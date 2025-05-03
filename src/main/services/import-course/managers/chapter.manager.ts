import { DatabaseService } from '../../database'
import { LessonManager } from './lesson.manager'

import { ChapterMetadata } from '@/types'

export class ChapterManager {
    #database: DatabaseService
    #lessonManager: LessonManager

    constructor(database: DatabaseService, lessonManager: LessonManager) {
        this.#database = database
        this.#lessonManager = lessonManager
    }
    process = async (courseId: string, chapterData: ChapterMetadata): Promise<void> => {
        try {
            await this.#database.chapter.create({
                id: chapterData.id,
                name: chapterData.name,
                position: chapterData.position,
                courseId: courseId
            })

            for (const lessonData of chapterData.lessons) {
                await this.#lessonManager.process(courseId, chapterData.id, lessonData)
            }

            console.log(`Chapter "${chapterData.name}" created in database`)
        } catch (error) {
            console.error('Error creating chapter in database:', error)
        }
    }
}
