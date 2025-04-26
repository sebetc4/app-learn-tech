import { DatabaseService } from '../database'
import { FolderService } from '../folder'
import { ArchiveManager, ImportManager } from './managers'
import * as fs from 'fs'
import * as path from 'path'

import { CourseMetadata, CoursePreviewData } from '@/types'

export class CourseService {
    #database: DatabaseService
    #folderService: FolderService

    #archiveManager: ArchiveManager
    #importManager: ImportManager

    constructor(database: DatabaseService, folderService: FolderService) {
        this.#database = database
        this.#folderService = folderService

        this.#archiveManager = new ArchiveManager()
        this.#importManager = new ImportManager(database)
    }

    async getAll(): Promise<CoursePreviewData> {
        try {
            return await this.#database.course.getAll()
        } catch (error) {
            console.error(`Error retrieving course list: ${error}`)
            throw error
        }
    }

    async importCourseArchive(zipFilePath: string): Promise<string> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            const rootPath = this.#getRootPath()

            const courseDir = await this.#archiveManager.extractArchive(zipFilePath, rootPath)

            const metadataPath = path.join(courseDir, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            console.log(`Importing course "${courseData.name}" (ID: ${courseData.id})`)

            await this.#importManager.process(courseData)

            console.log(`Course "${courseData.name}" successfully imported`)
            return courseData.id
        } catch (error) {
            console.error(`Error during course import: ${error}`)
            throw error
        }
    }

    async addOne(courseDirName: string): Promise<string> {
        try {
            const courseDirPath = path.join(this.#getRootPath(), courseDirName)
            if (!fs.existsSync(courseDirPath)) {
                throw new Error(`Course directory ${courseDirPath} does not exist`)
            }

            const courseMetadata = this.#getMetadata(courseDirPath)

            await this.#importManager.process(courseMetadata)

            return courseMetadata.id
        } catch (error) {
            console.error(`Error adding course: ${error}`)
            throw error
        }
    }

    async removeOne(courseId: string): Promise<void> {
        try {
            const courseDirPath = path.join(this.#getRootPath(), courseId)

            const course = await this.#database.course.getById(courseId)
            if (!course) {
                throw new Error(`Course ${courseId} not found in the database`)
            }

            await this.#database.course.deleteById(course.id)

            if (fs.existsSync(courseDirPath)) {
                fs.rmSync(courseDirPath, { recursive: true, force: true })
            }

            console.log(`Course ${course.id} successfully removed`)
        } catch (error) {
            console.error(`Error removing course: ${error}`)
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
