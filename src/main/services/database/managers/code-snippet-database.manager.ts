import { codeSnippets } from '@/database/schemas'

import { AutoSaveFunction, CodeSnippet, DrizzleDB } from '@/types'

interface CreateCodeSnippetParams {
    id: string
    position: number
    language: string
    extension: string

    lessonId: string
}

export class CodeSnippetDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreateCodeSnippetParams): Promise<CodeSnippet> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(codeSnippets).values(data).returning()
            return result[0]
        })
    }
}
