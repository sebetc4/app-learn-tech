import { DatabaseService } from '../database'
import { FolderService } from '../folder'
import { StorageService } from '../storage'
import { ArchiveManager, ChapterManager, CourseManager, LessonManager } from './managers'
import fs from 'fs'
import path from 'path'

import { CourseMetadata, CoursePreview } from '@/types'

export class ImportCourseService {
    #folderService: FolderService

    #archiveManager: ArchiveManager
    #lessonManager: LessonManager
    #chapterManager: ChapterManager
    #courseManager: CourseManager

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
    }

    async importArchive(zipFilePath: string): Promise<CoursePreview> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            const rootPath = this.#getRootPath()

            const courseDirPath = await this.#archiveManager.extractArchive(zipFilePath, rootPath)

            const metadataPath = path.join(courseDirPath, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            console.log(`Importing course "${courseData.name}" (ID: ${courseData.id})`)

            const coursePreview = await this.#courseManager.process(courseData, courseDirPath)

            console.log(`Course "${courseData.name}" successfully imported`)
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
