import { settings } from '@/database/schemas'
import { eq } from 'drizzle-orm'

import { AutoSaveFunction, DrizzleDB, Setting, SettingKey } from '@/types'

interface CreateOrUpdateSettingParams {
    key: SettingKey
    value: string
}

export class SettingDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreateOrUpdateSettingParams): Promise<Setting> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(settings).values(data).returning()

            return result[0]
        })
    }

    async get<T extends string>(key: SettingKey): Promise<T | null> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .select()
                .from(settings)
                .where(eq(settings.key, key))
                .limit(1)

            return result[0] ? (result[0].value as T) : null
        })
    }

    async update({ key, value }: CreateOrUpdateSettingParams): Promise<Setting> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .update(settings)
                .set({ value })
                .where(eq(settings.key, key))
                .returning()

            return result[0]
        })
    }

    async upsert(key: SettingKey, value: string): Promise<Setting> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .insert(settings)
                .values({ key, value })
                .onConflictDoUpdate({
                    target: settings.key,
                    set: { value }
                })
                .returning()

            return result[0]
        })
    }

    async delete(key: SettingKey): Promise<void> {
        return this.#autoSave(async () => {
            await this.#db.delete(settings).where(eq(settings.key, key))
        })
    }
}
