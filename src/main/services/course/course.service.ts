import { DatabaseService } from '../database'
import { FolderService } from '../folder'
import { StorageService } from '../storage'
import { ArchiveManager, ImportManager } from './managers'
import { Course } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

import { CourseMetadata, CourseMetadataAndDirectory, CoursePreview, ScannedCourse } from '@/types'

export class CourseService {
    #database: DatabaseService
    #folderService: FolderService

    #archiveManager: ArchiveManager
    #importManager: ImportManager

    constructor(
        database: DatabaseService,
        storageService: StorageService,
        folderService: FolderService
    ) {
        this.#database = database
        this.#folderService = folderService

        this.#archiveManager = new ArchiveManager()
        this.#importManager = new ImportManager(database, storageService)
    }

    async getOne(courseId: string): Promise<Course> {
        try {
            const course = await this.#database.course.getById(courseId)
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`)
            }
            return course
        } catch (error) {
            console.error(`Error retrieving course with ID ${courseId}: ${error}`)
            throw error
        }
    }

    async getAll(): Promise<CoursePreview[]> {
        try {
            return await this.#database.course.getAll()
        } catch (error) {
            console.error(`Error retrieving course list: ${error}`)
            throw error
        }
    }

    async sortScannedCourses(courses: CourseMetadataAndDirectory[]) {
        const alreadyImportedCourses = await this.getAll()
        const alreadyImportedCourseIds = alreadyImportedCourses.map((course) => course.id)
        const scannedCourses: ScannedCourse[] = []

        for (const course of courses) {
            if (alreadyImportedCourseIds.includes(course.metadata.id)) {
                const existingCourse = alreadyImportedCourses.find(
                    (c) => c.id === course.metadata.id
                )
                if (existingCourse && existingCourse.buildAt && course.metadata.buildAt) {
                    const existingBuildDate = new Date(existingCourse.buildAt)
                    const newBuildDate = new Date(course.metadata.buildAt)
                    if (newBuildDate > existingBuildDate)
                        scannedCourses.push({ ...course, type: 'update' })
                }
            } else {
                scannedCourses.push({ ...course, type: 'import' })
            }
        }

        return scannedCourses
    }

    async importCourseArchive(zipFilePath: string): Promise<CoursePreview> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            const rootPath = this.#getRootPath()

            const courseDirPath = await this.#archiveManager.extractArchive(zipFilePath, rootPath)

            const metadataPath = path.join(courseDirPath, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            console.log(`Importing course "${courseData.name}" (ID: ${courseData.id})`)

            const coursePreview = await this.#importManager.process(courseData, courseDirPath)

            console.log(`Course "${courseData.name}" successfully imported`)
            return coursePreview
        } catch (error) {
            console.error(`Error during course import: ${error}`)
            throw error
        }
    }

    async addOne(courseDirName: string): Promise<CoursePreview> {
        try {
            const courseDirPath = path.join(this.#getRootPath(), courseDirName)
            if (!fs.existsSync(courseDirPath)) {
                throw new Error(`Course directory ${courseDirPath} does not exist`)
            }

            const courseMetadata = this.#getMetadata(courseDirPath)

            const coursePreview = await this.#importManager.process(courseMetadata, courseDirPath)

            return coursePreview
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
