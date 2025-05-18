import { DatabaseService } from '../../database'
import { StorageService } from '../../storage'
import { ChapterManager } from './chapter.manager'
import path from 'path'

import { CourseMetadata, CoursePreview } from '@/types'

interface CreateCourseParams extends CourseMetadata {
    folderName: string
}

export class CourseManager {
    #database: DatabaseService
    #storage: StorageService

    #chapterManager: ChapterManager

    constructor(
        database: DatabaseService,
        storage: StorageService,
        chapterManager: ChapterManager
    ) {
        this.#database = database
        this.#storage = storage

        this.#chapterManager = chapterManager
    }
    async process(metadata: CourseMetadata, courseDirPath: string): Promise<CoursePreview> {
        try {
            const existingCourse =
                (await this.#database.course.getById(metadata.id)) ||
                (await this.#database.course.getByName(metadata.name))
            if (existingCourse) {
                return await this.#updateExistingCourse(metadata, courseDirPath)
            } else {
                const folderName = path.basename(courseDirPath)
                return await this.#createCourse({ ...metadata, folderName }, courseDirPath)
            }
        } catch (error) {
            console.error(`Error adding course to database: ${error}`)
            throw error
        }
    }

    async #createCourse(
        { id, name, description, chapters, folderName, buildAt }: CreateCourseParams,
        courseDirPath: string
    ): Promise<CoursePreview> {
        try {
            const courseIconPath = path.join(courseDirPath, 'icon.png')
            await this.#storage.icon.save(id, courseIconPath)

            await this.#database.course.create({
                id,
                name,
                description,
                folderName,
                buildAt
            })

            for (const chapterData of chapters) await this.#chapterManager.process(id, chapterData)

            return {
                id,
                name,
                description,
                folderName,
                buildAt
            }
        } catch (error) {
            console.error('Error creating course in database:', error)
            throw error
        }
    }

    async #updateExistingCourse(
        courseMetadata: CourseMetadata,
        courseDirPath: string
    ): Promise<CoursePreview> {
        try {
            await this.#database.course.deleteById(courseMetadata.id)

            const folderName = path.basename(courseDirPath)
            const coursePreview = await this.#createCourse(
                { ...courseMetadata, folderName },
                courseDirPath
            )

            return coursePreview
        } catch (error) {
            console.error('Error updating course in database:', error)
            throw error
        }
    }
}
