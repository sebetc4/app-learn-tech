import { DatabaseService } from '../../database'
import path from 'path'

import type { CodeSnippetMetadata, LessonMetadata, ResourceMetadata } from '@/types'

export class LessonManager {
    #database: DatabaseService

    constructor(database: DatabaseService) {
        this.#database = database
    }

    process = async (courseId: string, chapterId: string, lessonData: LessonMetadata) => {
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

            await Promise.all([
                this.#processLessonCodeSnippets(lessonData.id, lessonData.codeSnippets),
                this.#processLessonResources(lessonData.id, lessonData.resources)
            ])

            console.log(`Lesson "${lessonData.name}" created in database`)
        } catch (error) {
            console.error('Error creating lesson in database:', error)
        }
    }

    #lessonAssetPaths(
        lessonDir: string,
        lessonData: LessonMetadata
    ): { mdxPath?: string; videoPath?: string; videoDuration?: number } {
        if (lessonData.type === 'TEXT') {
            return {
                mdxPath: path.join(lessonDir, 'course.mdx')
            }
        } else if (lessonData.type === 'VIDEO') {
            return {
                videoPath: path.join(lessonDir, 'video.mp4'),
                videoDuration: lessonData.videoDuration
            }
        } else if (lessonData.type === 'TEXT_AND_VIDEO') {
            return {
                mdxPath: path.join(lessonDir, 'course.mdx'),
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
}
