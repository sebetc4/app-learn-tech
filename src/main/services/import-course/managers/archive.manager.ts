import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import yauzl from 'yauzl'

import { CourseMetadata } from '@/types'

export class ArchiveManager {
    public async extractArchive(
        archiveFilePath: string,
        courseRootPath: string,
        onProgress?: (percent: number) => void
    ): Promise<string> {
        try {
            // Create a temporary extraction directory
            const tempExtractPath = path.join(courseRootPath, '.temp-extract-' + Date.now())
            fs.mkdirSync(tempExtractPath, { recursive: true })

            console.log(`Course root path: ${courseRootPath}`)
            console.log(`Temporary extraction: ${tempExtractPath}`)

            try {
                // Detect archive type and extract to temp directory
                const archiveType = this.detectArchiveType(archiveFilePath)
                if (archiveType === 'zip') {
                    await this.extractZip(archiveFilePath, tempExtractPath, onProgress)
                } else if (archiveType === 'tar.zst') {
                    await this.extractTarZst(archiveFilePath, tempExtractPath, onProgress)
                } else {
                    throw new Error(`Unsupported archive type: ${path.extname(archiveFilePath)}`)
                }

                // Find the root folder containing metadata.json
                const rootFolder = this.findRootFolder(tempExtractPath)
                if (!rootFolder) {
                    throw new Error('File metadata.json is missing in the archive')
                }

                // Read metadata.json to get the course ID
                const metadataPath = path.join(rootFolder, 'metadata.json')
                const metadataContent = fs.readFileSync(metadataPath, 'utf8')
                const metadata = JSON.parse(metadataContent)
                const courseId = metadata.id

                if (!courseId) {
                    throw new Error('Course ID is missing in metadata.json')
                }

                // Use course ID as the final folder name
                const finalDestPath = path.join(courseRootPath, courseId)

                // If final destination exists, remove it
                if (fs.existsSync(finalDestPath)) {
                    this.removeDirectory(finalDestPath)
                }

                // Move the extracted folder to final destination
                fs.renameSync(rootFolder, finalDestPath)

                console.log(`Extraction completed successfully to ${finalDestPath}`)

                return finalDestPath
            } finally {
                // Cleanup temp directory
                if (fs.existsSync(tempExtractPath)) {
                    this.removeDirectory(tempExtractPath)
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'importation du cours:", error)
            throw error
        }
    }

    private findRootFolder(extractPath: string): string | null {
        // Recursive search for metadata.json
        const findMetadata = (currentPath: string, depth: number = 0): string | null => {
            // Limit depth to avoid infinite recursion
            if (depth > 5) return null

            // Check if metadata.json exists in current path
            if (fs.existsSync(path.join(currentPath, 'metadata.json'))) {
                return currentPath
            }

            // Search in subdirectories
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

    private detectArchiveType(filePath: string): 'zip' | 'tar.zst' | 'unknown' {
        if (filePath.endsWith('.zip')) {
            return 'zip'
        } else if (filePath.endsWith('.tar.zst') || filePath.endsWith('.tzst')) {
            return 'tar.zst'
        }
        return 'unknown'
    }

    private async extractZip(
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

                    // File entry - process in parallel
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

    private async extractTarZst(
        tarZstFilePath: string,
        extractPath: string,
        onProgress?: (percent: number) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            let args: string[]
            const command = 'tar'

            if (process.platform === 'win32') {
                args = ['-xvf', tarZstFilePath, '-C', extractPath]
            } else {
                args = ['--use-compress-program=unzstd', '-xvf', tarZstFilePath, '-C', extractPath]
            }

            const tarProcess = spawn(command, args)

            let filesExtracted = 0
            let lastProgressUpdate = Date.now()
            let errorOutput = ''

            // tar with -v outputs file list to stdout
            tarProcess.stdout.on('data', (data: Buffer) => {
                const output = data.toString()
                const lines = output.split('\n').filter((line) => line.trim().length > 0)
                filesExtracted += lines.length

                // Update progress every 100ms to avoid too many updates
                const now = Date.now()
                if (onProgress && now - lastProgressUpdate > 100) {
                    // Estimate progress (we don't know total files, so increment gradually)
                    const estimatedProgress = Math.min(95, 10 + filesExtracted / 50)
                    onProgress(Math.round(estimatedProgress))
                    lastProgressUpdate = now
                }
            })

            // Capture error messages
            tarProcess.stderr.on('data', (data: Buffer) => {
                errorOutput += data.toString()
            })

            tarProcess.on('error', (error) => {
                console.error(`Error extracting tar.zst file ${tarZstFilePath}:`, error)

                if (process.platform === 'win32') {
                    reject(
                        new Error(
                            'Failed to extract tar.zst archive. Please ensure you are using Windows 10 version 1803 or later, or extract the archive manually.'
                        )
                    )
                } else {
                    reject(error)
                }
            })

            tarProcess.on('close', (code) => {
                if (code === 0) {
                    if (onProgress) {
                        onProgress(100)
                    }
                    resolve()
                } else {
                    const errorMsg = errorOutput || `tar extraction failed with code ${code}`
                    console.error('tar extraction error:', errorMsg)
                    reject(new Error(errorMsg))
                }
            })
        })
    }

    private removeDirectory(dirPath: string): void {
        try {
            fs.rmSync(dirPath, { recursive: true, force: true })
        } catch (error) {
            console.error(`Erreur lors de la suppression du dossier ${dirPath}:`, error)
            throw error
        }
    }

    public async extractMetadataOnly(archiveFilePath: string): Promise<CourseMetadata> {
        const archiveType = this.detectArchiveType(archiveFilePath)

        if (archiveType === 'zip') {
            return this.extractMetadataFromZip(archiveFilePath)
        } else if (archiveType === 'tar.zst') {
            return this.extractMetadataFromTarZst(archiveFilePath)
        } else {
            throw new Error(`Unsupported archive type: ${path.extname(archiveFilePath)}`)
        }
    }

    private extractMetadataFromZip(zipFilePath: string): Promise<CourseMetadata> {
        return new Promise((resolve, reject) => {
            yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
                if (err || !zipfile) {
                    reject(new Error('Failed to open zip archive'))
                    return
                }

                zipfile.readEntry()

                zipfile.on('entry', (entry) => {
                    // Check if this entry is metadata.json (could be nested)
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
                        zipfile.readEntry() // Continue to next entry
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

    private async extractMetadataFromTarZst(tarZstFilePath: string): Promise<CourseMetadata> {
        // First, list files to find metadata.json path
        const metadataPath = await this.findMetadataInTarZst(tarZstFilePath)

        // Then extract the specific file
        return new Promise((resolve, reject) => {
            const command = 'tar'
            let args: string[]

            if (process.platform === 'win32') {
                args = ['-xf', tarZstFilePath, metadataPath, '-O']
            } else {
                args = ['--use-compress-program=unzstd', '-xf', tarZstFilePath, metadataPath, '-O']
            }

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
                if (process.platform === 'win32') {
                    reject(
                        new Error(
                            'Failed to extract tar.zst archive. Please ensure you are using Windows 10 version 1803 or later.'
                        )
                    )
                } else {
                    reject(error)
                }
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

    private async findMetadataInTarZst(tarZstFilePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const command = 'tar'
            let args: string[]

            // List archive contents
            if (process.platform === 'win32') {
                args = ['-tf', tarZstFilePath]
            } else {
                args = ['--use-compress-program=unzstd', '-tf', tarZstFilePath]
            }

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
                if (process.platform === 'win32') {
                    reject(
                        new Error(
                            'Failed to list tar.zst archive contents. Please ensure you are using Windows 10 version 1803 or later.'
                        )
                    )
                } else {
                    reject(error)
                }
            })

            tarProcess.on('close', (code) => {
                if (code === 0) {
                    // Find metadata.json in the file list
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
}
