import { DatabaseService } from '../database'
import { FolderService } from '../folder'
import { ImportCourseService } from '../import-course'
import fs from 'fs'
import path from 'path'

import type {
    CourseMetadataAndDirectory,
    CoursePreview,
    CourseViewModel,
    RecentCourseViewModel,
    ScannedCourse
} from '@/types'

export class CourseService {
    #database: DatabaseService
    #folderService: FolderService
    #importCourseService: ImportCourseService
    constructor(
        database: DatabaseService,
        folderService: FolderService,
        importCourseService: ImportCourseService
    ) {
        this.#database = database
        this.#folderService = folderService
        this.#importCourseService = importCourseService
    }

    // Create
    async create(path: string, type: 'archive' | 'directory'): Promise<CoursePreview> {
        try {
            return type === 'archive'
                ? this.#importCourseService.importArchive(path)
                : this.#importCourseService.importDirectory(path)
        } catch (error) {
            console.error(`Error adding course: ${error}`)
            throw error
        }
    }

    async recordAccess(userId: string, courseId: string): Promise<void> {
        try {
            await this.#database.courseHistory.recordAccess(userId, courseId)
        } catch (error) {
            console.error(`Error recording course access: ${error}`)
            throw error
        }
    }

    // Read
    async getOne(courseId: string, userId: string): Promise<CourseViewModel> {
        try {
            const course = await this.#database.course.getCourseViewModelById({ courseId, userId })
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`)
            }
            await this.recordAccess(userId, courseId)
            return course
        } catch (error) {
            console.error(`Error retrieving course with ID ${courseId}: ${error}`)
            throw error
        }
    }

    async getRecentCourses(userId: string, limit: number = 5): Promise<RecentCourseViewModel[]> {
        try {
            return await this.#database.courseHistory.getRecentCourses(userId, limit)
        } catch (error) {
            console.error(`Error retrieving recent courses: ${error}`)
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

    // Remove
    async removeOne(courseId: string): Promise<void> {
        try {
            const rootPath = this.#folderService.rootPath
            if (!rootPath) throw new Error('Root path is not set')
            const courseDirPath = path.join(rootPath, courseId)

            const course = await this.#database.course.getById(courseId)
            if (!course) {
                throw new Error(`Course ${courseId} not found in the database`)
            }

            await this.#database.course.deleteById(course.id)

            if (fs.existsSync(courseDirPath)) {
                fs.rmSync(courseDirPath, { recursive: true, force: true })
            }
        } catch (error) {
            console.error(`Error removing course: ${error}`)
            throw error
        }
    }

    // Utility
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
}
