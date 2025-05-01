import { DatabaseService } from '../../database'
import { StorageService } from '../../storage'
import * as path from 'path'

import type {
    ChapterMetadata,
    CodeSnippetMetadata,
    CourseMetadata,
    CoursePreview,
    LessonMetadata,
    ResourceMetadata
} from '@/types'

export class ImportManager {
    #database: DatabaseService
    #storage: StorageService

    constructor(database: DatabaseService, storage: StorageService) {
        this.#database = database
        this.#storage = storage
    }

    async process(metadata: CourseMetadata, courseDirPath: string): Promise<CoursePreview> {
        try {
            const existingCourse =
                (await this.#database.course.getById(metadata.id)) ||
                (await this.#database.course.getByName(metadata.name))
            if (existingCourse) {
                return await this.#updateExistingCourse(metadata, courseDirPath)
            } else {
                return await this.#createNewCourse(metadata, courseDirPath)
            }
        } catch (error) {
            console.error(`Error adding course to database: ${error}`)
            throw error
        }
    }

    async #createNewCourse(
        { id, name, description, chapters, buildAt }: CourseMetadata,
        courseDirPath: string
    ): Promise<CoursePreview> {
        try {
            const courseIconPath = path.join(courseDirPath, 'icon.png')
            const iconPath = await this.#storage.icon.save(id, courseIconPath)

            await this.#database.course.create({
                id,
                name,
                description,
                iconPath,
                buildAt
            })

            for (const chapterData of chapters) {
                await this.#processChatper(id, chapterData)
            }

            console.log(`Course "${name}" created in database`)
            return {
                id,
                name,
                description,
                iconPath,
                buildAt
            }
        } catch (error) {
            console.error('Error creating course in database:', error)
            throw error
        }
    }

    #processChatper = async (courseId: string, chapterData: ChapterMetadata): Promise<void> => {
        try {
            await this.#database.chapter.create({
                id: chapterData.id,
                name: chapterData.name,
                position: chapterData.position,
                courseId: courseId
            })

            for (const lessonData of chapterData.lessons) {
                await this.#processLesson(courseId, chapterData.id, lessonData)
            }

            console.log(`Chapter "${chapterData.name}" created in database`)
        } catch (error) {
            console.error('Error creating chapter in database:', error)
        }
    }

    #processLesson = async (courseId: string, chapterId: string, lessonData: LessonMetadata) => {
        try {
            const lessonDir = path.join(courseId, 'chapters', chapterId, lessonData.id)

            const assetPaths = this.#lessonAssetPaths(lessonDir, lessonData)

            await this.#database.lesson.create({
                id: lessonData.id,
                name: lessonData.name,
                position: lessonData.position,
                chapterId: chapterId,
                type: lessonData.type,
                ...assetPaths
            })

            await this.#processLessonCodeSnippets(lessonData.id, lessonData.codeSnippets)

            await this.#processLessonResources(lessonData.id, lessonData.resources)

            console.log(`Lesson "${lessonData.name}" created in database`)
        } catch (error) {
            console.error('Error creating lesson in database:', error)
        }
    }

    #lessonAssetPaths(
        lessonDir: string,
        lessonData: LessonMetadata
    ): { htmlPath?: string; videoPath?: string; videoDuration?: number } {
        if (lessonData.type === 'TEXT') {
            return {
                htmlPath: path.join(lessonDir, 'index.html')
            }
        } else if (lessonData.type === 'VIDEO') {
            return {
                videoPath: path.join(lessonDir, 'video.mp4'),
                videoDuration: lessonData.videoDuration
            }
        } else if (lessonData.type === 'TEXT_AND_VIDEO') {
            return {
                htmlPath: path.join(lessonDir, 'index.html'),
                videoPath: path.join(lessonDir, 'video.mp4'),
                videoDuration: lessonData.videoDuration
            }
        } else {
            throw new Error(`Unknown lesson type: ${lessonData.type}`)
        }
    }

    async #processLessonCodeSnippets(lessonId: string, codeSnippets: CodeSnippetMetadata[]) {
        try {
            for (const codeSnippet of codeSnippets) {
                await this.#database.codeSnippet.create({
                    ...codeSnippet,
                    lessonId
                })
            }
            console.log(`Code snippets for lesson ${lessonId} processed`)
        } catch (error) {
            console.error('Error processing lesson code snippets:', error)
            throw error
        }
    }

    async #processLessonResources(lessonId: string, resources: ResourceMetadata[]) {
        try {
            for (const resource of resources) {
                await this.#database.resource.create({
                    id: resource.id,
                    type: resource.type,
                    url: resource.url,
                    lessonId: lessonId
                })
            }
            console.log(`Resources for lesson ${lessonId} processed`)
        } catch (error) {
            console.error('Error processing lesson resources:', error)
            throw error
        }
    }

    async #updateExistingCourse(
        courseMetadata: CourseMetadata,
        courseDirPath: string
    ): Promise<CoursePreview> {
        try {
            await this.#database.course.deleteById(courseMetadata.id)

            const coursePreview = await this.#createNewCourse(courseMetadata, courseDirPath)

            console.log(`Course "${courseMetadata.name}" updated in database`)

            return coursePreview
        } catch (error) {
            console.error('Error updating course in database:', error)
            throw error
        }
    }
}
