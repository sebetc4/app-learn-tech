import { resources } from '@/database/schemas'

import { AutoSaveFunction, DrizzleDB, Resource, ResourceType } from '@/types'

interface CreatResourceParams {
    id: string
    type: ResourceType
    url: string

    lessonId: string
}

export class ResourceDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreatResourceParams): Promise<Resource> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(resources).values(data).returning()
            return result[0]
        })
    }
}
