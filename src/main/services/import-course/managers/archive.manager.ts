import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import yauzl from 'yauzl'

import { CourseMetadata } from '@/types'

export class ArchiveManager {
    // ============================================================================
    // PUBLIC METHODS
    // ============================================================================

    /**
     * Extract archive (ZIP or TAR.ZST) to destination folder
     * Used for full extraction after duplicate check (or on Windows with TAR.ZST)
     */
    public async extractArchive(
        archiveFilePath: string,
        courseRootPath: string,
        onProgress?: (percent: number) => void
    ): Promise<string> {
        const tempExtractPath = path.join(courseRootPath, '.temp-extract-' + Date.now())

        try {
            fs.mkdirSync(tempExtractPath, { recursive: true })

            // Extract to temp directory
            const archiveType = this.#detectArchiveType(archiveFilePath)
            if (archiveType === 'zip') {
                await this.#extractZip(archiveFilePath, tempExtractPath, onProgress)
            } else if (archiveType === 'tar.zst') {
                await this.#extractTarZst(archiveFilePath, tempExtractPath, onProgress)
            } else {
                throw new Error(`Unsupported archive type: ${path.extname(archiveFilePath)}`)
            }

            // Find root folder containing metadata.json
            const rootFolder = this.#findRootFolder(tempExtractPath)
            if (!rootFolder) {
                throw new Error('File metadata.json is missing in the archive')
            }

            // Read metadata to get course ID
            const metadataPath = path.join(rootFolder, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const metadata = JSON.parse(metadataContent)
            const courseId = metadata.id

            if (!courseId) {
                throw new Error('Course ID is missing in metadata.json')
            }

            // Move to final destination with course ID as folder name
            const finalDestPath = path.join(courseRootPath, courseId)

            if (fs.existsSync(finalDestPath)) {
                fs.rmSync(finalDestPath, { recursive: true, force: true })
            }

            fs.renameSync(rootFolder, finalDestPath)

            return finalDestPath
        } catch (error) {
            console.error('Error extracting archive:', error)
            throw error
        } finally {
            // Cleanup temp directory
            if (fs.existsSync(tempExtractPath)) {
                fs.rmSync(tempExtractPath, { recursive: true, force: true })
            }
        }
    }

    /**
     * Extract metadata.json ONLY from archive (optimization)
     * Used for duplicate checking before full extraction
     *
     * Platform-specific behavior:
     * - ZIP (all platforms): Extract metadata.json only
     * - TAR.ZST (Linux/macOS): Extract metadata.json only using tar with unzstd
     * - TAR.ZST (Windows): Throws special error to trigger full extraction in ImportCourseService
     */
    public async extractMetadataOnly(archiveFilePath: string): Promise<CourseMetadata> {
        const archiveType = this.#detectArchiveType(archiveFilePath)

        if (archiveType === 'zip') {
            return this.#extractMetadataFromZip(archiveFilePath)
        } else if (archiveType === 'tar.zst') {
            // Windows tar.zst: Full extraction handled by ImportCourseService
            if (process.platform === 'win32') {
                throw new Error('WINDOWS_TAR_ZST_SKIP_METADATA_CHECK')
            }
            // Linux/macOS: Extract metadata only
            return this.#extractMetadataFromTarZst(archiveFilePath)
        } else {
            throw new Error(`Unsupported archive type: ${path.extname(archiveFilePath)}`)
        }
    }

    // ============================================================================
    // PRIVATE METHODS - ARCHIVE DETECTION
    // ============================================================================

    #detectArchiveType(filePath: string): 'zip' | 'tar.zst' | 'unknown' {
        if (filePath.endsWith('.zip')) {
            return 'zip'
        } else if (filePath.endsWith('.tar.zst') || filePath.endsWith('.tzst')) {
            return 'tar.zst'
        }
        return 'unknown'
    }

    // ============================================================================
    // PRIVATE METHODS - FULL EXTRACTION
    // ============================================================================

    async #extractZip(
        zipFilePath: string,
        extractPath: string,
        onProgress?: (percent: number) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            yauzl.open(zipFilePath, { autoClose: true }, (err, zipfile) => {
                if (err || !zipfile) {
                    reject(err || new Error('Failed to open zip file'))
                    return
                }

                let entriesProcessed = 0
                const totalEntries = zipfile.entryCount
                let pendingWrites = 0
                let hasError = false

                const checkComplete = () => {
                    if (entriesProcessed === totalEntries && pendingWrites === 0 && !hasError) {
                        if (onProgress) onProgress(100)
                        resolve()
                    }
                }

                zipfile.on('entry', (entry) => {
                    if (hasError) return

                    const entryPath = path.join(extractPath, entry.fileName)

                    // Directory entry
                    if (entry.fileName.endsWith('/')) {
                        fs.mkdirSync(entryPath, { recursive: true })
                        entriesProcessed++
                        if (onProgress) {
                            onProgress(Math.round((entriesProcessed / totalEntries) * 100))
                        }
                        checkComplete()
                        return
                    }

                    // File entry
                    fs.mkdirSync(path.dirname(entryPath), { recursive: true })

                    pendingWrites++
                    zipfile.openReadStream(entry, (err, readStream) => {
                        if (err || !readStream) {
                            if (!hasError) {
                                hasError = true
                                reject(err || new Error('Failed to read entry stream'))
                            }
                            return
                        }

                        const writeStream = fs.createWriteStream(entryPath)
                        readStream.pipe(writeStream)

                        writeStream.on('finish', () => {
                            pendingWrites--
                            entriesProcessed++
                            if (onProgress) {
                                onProgress(Math.round((entriesProcessed / totalEntries) * 100))
                            }
                            checkComplete()
                        })

                        writeStream.on('error', (error) => {
                            if (!hasError) {
                                hasError = true
                                reject(error)
                            }
                        })

                        readStream.on('error', (error) => {
                            if (!hasError) {
                                hasError = true
                                reject(error)
                            }
                        })
                    })
                })

                zipfile.on('error', (error) => {
                    if (!hasError) {
                        hasError = true
                        reject(error)
                    }
                })
            })
        })
    }

    async #extractTarZst(
        tarZstFilePath: string,
        extractPath: string,
        onProgress?: (percent: number) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = 'tar'
            const args =
                process.platform === 'win32'
                    ? ['-xvf', tarZstFilePath, '-C', extractPath]
                    : ['--use-compress-program=unzstd', '-xvf', tarZstFilePath, '-C', extractPath]

            const tarProcess = spawn(command, args)

            let filesExtracted = 0
            let lastProgressUpdate = Date.now()
            let errorOutput = ''

            tarProcess.stdout.on('data', (data: Buffer) => {
                const output = data.toString()
                const lines = output.split('\n').filter((line) => line.trim().length > 0)
                filesExtracted += lines.length

                // Update progress every 100ms
                const now = Date.now()
                if (onProgress && now - lastProgressUpdate > 100) {
                    const estimatedProgress = Math.min(95, 10 + filesExtracted / 50)
                    onProgress(Math.round(estimatedProgress))
                    lastProgressUpdate = now
                }
            })

            tarProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString()
            })

            tarProcess.on('error', (error) => {
                const errorMsg =
                    process.platform === 'win32'
                        ? 'Failed to extract tar.zst archive. Please ensure you are using Windows 10 version 1803 or later.'
                        : error.message
                reject(new Error(errorMsg))
            })

            tarProcess.on('close', (code) => {
                if (code === 0) {
                    if (onProgress) onProgress(100)
                    resolve()
                } else {
                    const errorMsg = errorOutput || `tar extraction failed with code ${code}`
                    reject(new Error(errorMsg))
                }
            })
        })
    }

    // ============================================================================
    // PRIVATE METHODS - METADATA-ONLY EXTRACTION
    // ============================================================================

    /**
     * Extract metadata.json only from ZIP archive
     * Used for duplicate checking without full extraction
     */
    #extractMetadataFromZip(zipFilePath: string): Promise<CourseMetadata> {
        return new Promise((resolve, reject) => {
            yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
                if (err || !zipfile) {
                    reject(new Error('Failed to open zip archive'))
                    return
                }

                zipfile.readEntry()

                zipfile.on('entry', (entry) => {
                    if (entry.fileName.endsWith('metadata.json')) {
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err || !readStream) {
                                reject(new Error('Failed to read metadata.json from archive'))
                                return
                            }

                            let data = ''
                            readStream.on('data', (chunk) => {
                                data += chunk.toString()
                            })
                            readStream.on('end', () => {
                                try {
                                    const metadata: CourseMetadata = JSON.parse(data)
                                    zipfile.close()
                                    resolve(metadata)
                                } catch {
                                    reject(new Error('Invalid metadata.json format'))
                                }
                            })
                            readStream.on('error', (readErr) => {
                                reject(new Error(`Error reading metadata.json: ${readErr.message}`))
                            })
                        })
                    } else {
                        zipfile.readEntry()
                    }
                })

                zipfile.on('end', () => {
                    reject(new Error("Le fichier metadata.json est introuvable dans l'archive"))
                })

                zipfile.on('error', (zipErr) => {
                    reject(new Error(`Error reading zip archive: ${zipErr.message}`))
                })
            })
        })
    }

    /**
     * Extract metadata.json only from TAR.ZST archive (Linux/macOS only)
     * Uses tar with unzstd to extract specific file
     */
    async #extractMetadataFromTarZst(tarZstFilePath: string): Promise<CourseMetadata> {
        // List archive contents to find metadata.json path
        const metadataPath = await this.#listTarZstAndFindMetadata(tarZstFilePath)

        // Extract the specific file to stdout
        return new Promise((resolve, reject) => {
            const command = 'tar'
            const args = [
                '--use-compress-program=unzstd',
                '-xf',
                tarZstFilePath,
                metadataPath,
                '-O'
            ]

            const tarProcess = spawn(command, args)

            let output = ''
            let errorOutput = ''

            tarProcess.stdout.on('data', (data: Buffer) => {
                output += data.toString()
            })

            tarProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString()
            })

            tarProcess.on('error', (error) => {
                reject(new Error(`Failed to extract metadata: ${error.message}`))
            })

            tarProcess.on('close', (code) => {
                if (code === 0 && output) {
                    try {
                        const metadata: CourseMetadata = JSON.parse(output)
                        resolve(metadata)
                    } catch {
                        reject(new Error('Invalid metadata.json format'))
                    }
                } else {
                    const errorMsg =
                        errorOutput || "Le fichier metadata.json est introuvable dans l'archive"
                    reject(new Error(errorMsg))
                }
            })
        })
    }

    /**
     * List TAR.ZST archive contents and find metadata.json path
     * Linux/macOS only
     */
    async #listTarZstAndFindMetadata(tarZstFilePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = 'tar'
            const args = ['--use-compress-program=unzstd', '-tf', tarZstFilePath]

            const tarProcess = spawn(command, args)

            let output = ''
            let errorOutput = ''

            tarProcess.stdout.on('data', (data: Buffer) => {
                output += data.toString()
            })

            tarProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString()
            })

            tarProcess.on('error', (error) => {
                reject(new Error(`Failed to list archive contents: ${error.message}`))
            })

            tarProcess.on('close', (code) => {
                if (code === 0) {
                    const files = output.split('\n')
                    const metadataFile = files.find((file) => file.endsWith('metadata.json'))

                    if (metadataFile) {
                        resolve(metadataFile.trim())
                    } else {
                        reject(new Error("Le fichier metadata.json est introuvable dans l'archive"))
                    }
                } else {
                    const errorMsg = errorOutput || 'Failed to list archive contents'
                    reject(new Error(errorMsg))
                }
            })
        })
    }

    // ============================================================================
    // PRIVATE METHODS - UTILITIES
    // ============================================================================

    /**
     * Find folder containing metadata.json in extracted directory
     * Searches up to 5 levels deep
     */
    #findRootFolder(extractPath: string): string | null {
        const findMetadata = (currentPath: string, depth: number = 0): string | null => {
            if (depth > 5) return null

            if (fs.existsSync(path.join(currentPath, 'metadata.json'))) {
                return currentPath
            }

            const entries = fs.readdirSync(currentPath, { withFileTypes: true })
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subdirPath = path.join(currentPath, entry.name)
                    const result = findMetadata(subdirPath, depth + 1)
                    if (result) return result
                }
            }

            return null
        }

        return findMetadata(extractPath)
    }
}
