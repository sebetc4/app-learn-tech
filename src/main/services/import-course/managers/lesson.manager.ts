import { DatabaseService } from '../../database'

import type { CodeSnippetMetadata, LessonMetadata, ResourceMetadata } from '@/types'

interface ProcessParams extends LessonMetadata {
    courseId: string
}

export class LessonManager {
    #database: DatabaseService

    constructor(database: DatabaseService) {
        this.#database = database
    }

    process = async (
        chapterId: string,
        {
            id,
            name,
            position,
            type,
            videoDuration,
            codeSnippets,
            resources,
            courseId
        }: ProcessParams
    ) => {
        try {
            await this.#database.lesson.create({
                id,
                name,
                position,
                type,
                videoDuration,
                chapterId,
                courseId
            })

            await Promise.all([
                this.#processLessonCodeSnippets(id, codeSnippets),
                this.#processLessonResources(id, resources)
            ])
        } catch (error) {
            console.error('Error creating lesson in database:', error)
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
        } catch (error) {
            console.error('Error processing lesson resources:', error)
            throw error
        }
    }
}
