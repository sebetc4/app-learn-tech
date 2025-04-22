import { exec } from 'child_process'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { CourseMetadata } from '@/types'

const execPromise = promisify(exec)

export class ArchiveManager {
    #userDataPath: string
    #tempPath: string

    constructor() {
        this.#userDataPath = app.getPath('userData')
        this.#tempPath = path.join(this.#userDataPath, 'temp')
    }

    public async extractArchive(zipFilePath: string, courseRootPath: string) {
        try {
            console.log(`Extracting archive: ${zipFilePath}`)

            // Extraire le nom de base du fichier zip (sans extension)
            const zipFileName = path.basename(zipFilePath, path.extname(zipFilePath))

            // Créer le chemin de destination final basé sur le nom du fichier zip
            const finalDestPath = path.join(courseRootPath, zipFileName)

            const tempId = `extract_${Date.now()}`
            const extractPath = path.join(this.#tempPath, tempId)

            fs.mkdirSync(extractPath, { recursive: true })
            await this.extractZipFile(zipFilePath, extractPath)

            const metadataPath = path.join(extractPath, 'metadata.json')
            if (!fs.existsSync(metadataPath)) {
                throw new Error('File metadata.json is missing in the zip file')
            }

            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseMetadata: CourseMetadata = JSON.parse(metadataContent)
            console.log(`Imported course data:`, courseMetadata.name)

            fs.mkdirSync(path.dirname(finalDestPath), { recursive: true })

            await this.moveDirectory(extractPath, finalDestPath)

            await this.cleanupTempFolder(tempId)
            console.log(`Course imported successfully:`, courseMetadata.name)

            return finalDestPath
        } catch (error) {
            console.error("Erreur lors de l'importation du cours:", error)
            throw error
        }
    }

    async extractZipFile(zipFilePath: string, extractPath: string): Promise<void> {
        try {
            const cmd =
                process.platform === 'win32'
                    ? `powershell -command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${extractPath}' -Force"`
                    : `unzip -o "${zipFilePath}" -d "${extractPath}"`
            await execPromise(cmd)
            console.log(`File ${zipFilePath} extracted to ${extractPath}`)
        } catch (error) {
            console.error(`Error extracting file ${zipFilePath}: ${error}`)
            throw error
        }
    }

    private async removeDirectory(dirPath: string): Promise<void> {
        try {
            const cmd =
                process.platform === 'win32'
                    ? `powershell -command "Remove-Item -Path '${dirPath}' -Recurse -Force"`
                    : `rm -rf "${dirPath}"`
            await execPromise(cmd)
        } catch (error) {
            console.error(`Erreur lors de la suppression du dossier ${dirPath}:`, error)
            throw error
        }
    }

    private async moveDirectory(sourcePath: string, destPath: string): Promise<void> {
        try {
            fs.mkdirSync(destPath, { recursive: true })
            const cmd =
                process.platform === 'win32'
                    ? `powershell -command "Move-Item -Path '${sourcePath}\\*' -Destination '${destPath}' -Force"`
                    : `mv "${sourcePath}"/* "${destPath}"/`
            await execPromise(cmd)
        } catch (error) {
            console.error(
                `Erreur lors du déplacement du dossier de ${sourcePath} vers ${destPath}:`,
                error
            )
            throw error
        }
    }

    private async cleanupTempFolder(tempId: string): Promise<void> {
        try {
            const tempFolderPath = path.join(this.#tempPath, tempId)
            if (fs.existsSync(tempFolderPath)) {
                await this.removeDirectory(tempFolderPath)
            }
        } catch (error) {
            console.error(`Error during cleanup of temp folder ${tempId}: ${error}`)
        }
    }
}
