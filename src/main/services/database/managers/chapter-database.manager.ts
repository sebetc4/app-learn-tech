import { chapters } from '@/database/schemas'
import { eq } from 'drizzle-orm'

import { AutoSaveFunction, DrizzleDB } from '@/types'
import { Chapter } from '@/types/database/schema.types'

interface CreateChapterParams {
    id: string
    position: number
    name: string
    courseId: string
}

export class ChapterDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreateChapterParams): Promise<Chapter> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(chapters).values(data).returning()

            return result[0]
        })
    }

    async getById(id: string): Promise<Chapter | null> {
        const result = await this.#db.select().from(chapters).where(eq(chapters.id, id)).limit(1)

        return result[0] || null
    }
}
