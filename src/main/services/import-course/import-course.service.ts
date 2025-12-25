import { DatabaseService } from '../database'
import { FolderService } from '../folder'
import { StorageService } from '../storage'
import { ArchiveManager, ChapterManager, CourseManager, LessonManager } from './managers'
import { DuplicateCheckManager } from './managers/duplicate-check.manager'
import { IPC } from '@/constants/ipc'
import { BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'

import { CourseMetadata, CoursePreview } from '@/types'

export class ImportCourseService {
    #folderService: FolderService

    #archiveManager: ArchiveManager
    #lessonManager: LessonManager
    #chapterManager: ChapterManager
    #courseManager: CourseManager
    #duplicateCheckManager: DuplicateCheckManager

    constructor(
        database: DatabaseService,
        storageService: StorageService,
        folderService: FolderService
    ) {
        this.#folderService = folderService

        this.#archiveManager = new ArchiveManager()
        this.#lessonManager = new LessonManager(database)
        this.#chapterManager = new ChapterManager(database, this.#lessonManager)
        this.#courseManager = new CourseManager(database, storageService, this.#chapterManager)
        this.#duplicateCheckManager = new DuplicateCheckManager(database)
    }

    async importArchive(
        zipFilePath: string,
        mainWindow: BrowserWindow | null
    ): Promise<CoursePreview> {
        try {
            const rootPath = this.#getRootPath()
            let metadata: CourseMetadata
            let courseDirPath: string

            // Special handling for Windows with tar.zst files
            const isWindowsTarZst =
                process.platform === 'win32' &&
                (zipFilePath.endsWith('.tar.zst') || zipFilePath.endsWith('.tzst'))

            if (isWindowsTarZst) {
                // On Windows with tar.zst: extract first, then check for duplicates
                // Notify renderer that extraction is starting
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send(IPC.FOLDER.IMPORT_ARCHIVE_START)
                }

                // STEP 1: Extract full archive to temp directory
                courseDirPath = await this.#archiveManager.extractArchive(
                    zipFilePath,
                    rootPath,
                    (progress: number) => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send(IPC.FOLDER.IMPORT_ARCHIVE_PROGRESS, progress)
                        }
                    }
                )

                // STEP 2: Read metadata from extracted directory
                metadata = this.#getMetadata(courseDirPath)

                // Validate course ID
                if (!metadata.id) {
                    // Cleanup extracted directory
                    if (fs.existsSync(courseDirPath)) {
                        fs.rmSync(courseDirPath, { recursive: true, force: true })
                    }
                    throw new Error("L'ID du cours est manquant dans metadata.json")
                }

                // STEP 3: Check for duplicates
                const duplicateCheck = await this.#duplicateCheckManager.checkDuplicate(metadata)

                // STEP 4: Handle duplicate cases
                if (duplicateCheck.action === 'reject') {
                    // Cleanup extracted directory before throwing error
                    if (fs.existsSync(courseDirPath)) {
                        fs.rmSync(courseDirPath, { recursive: true, force: true })
                    }
                    throw new Error(duplicateCheck.message)
                }
            } else {
                // Standard flow for ZIP and tar.zst on non-Windows
                // STEP 1: Extract metadata ONLY
                metadata = await this.#archiveManager.extractMetadataOnly(zipFilePath)

                // Validate course ID
                if (!metadata.id) {
                    throw new Error("L'ID du cours est manquant dans metadata.json")
                }

                // STEP 2: Check for duplicates
                const duplicateCheck = await this.#duplicateCheckManager.checkDuplicate(metadata)

                // STEP 3: Handle duplicate cases
                if (duplicateCheck.action === 'reject') {
                    throw new Error(duplicateCheck.message)
                }

                // Notify renderer that extraction is starting
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send(IPC.FOLDER.IMPORT_ARCHIVE_START)
                }

                // STEP 4: Extract full archive
                courseDirPath = await this.#archiveManager.extractArchive(
                    zipFilePath,
                    rootPath,
                    (progress: number) => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send(IPC.FOLDER.IMPORT_ARCHIVE_PROGRESS, progress)
                        }
                    }
                )
            }

            // STEP 5: Process course
            const coursePreview = await this.#courseManager.process(metadata, courseDirPath)

            return coursePreview
        } catch (error) {
            console.error(`Error during course import: ${error}`)
            throw error
        }
    }

    async importDirectory(courseDirName: string): Promise<CoursePreview> {
        try {
            const courseDirPath = path.join(this.#getRootPath(), courseDirName)
            if (!fs.existsSync(courseDirPath)) {
                throw new Error(`Course directory ${courseDirPath} does not exist`)
            }

            const courseMetadata = this.#getMetadata(courseDirPath)

            const coursePreview = await this.#courseManager.process(courseMetadata, courseDirPath)

            return coursePreview
        } catch (error) {
            console.error(`Error adding course: ${error}`)
            throw error
        }
    }

    #getRootPath(): string {
        const rootPath = this.#folderService.rootPath
        if (!rootPath) throw new Error('Root path is not set')
        return rootPath
    }

    #getMetadata(coursePath: string): CourseMetadata {
        const metadataPath = path.join(coursePath, 'metadata.json')
        if (!fs.existsSync(metadataPath)) {
            throw new Error(`metadata.json file not found in ${coursePath}`)
        }
        const metadataContent = fs.readFileSync(metadataPath, 'utf8')
        const courseData: CourseMetadata = JSON.parse(metadataContent)
        return courseData
    }
}
