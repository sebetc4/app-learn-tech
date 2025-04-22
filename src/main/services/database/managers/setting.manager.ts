import { PrismaClient, Setting, SettingKey } from '@prisma/client'

interface CreateOrUpdateSettingParams {
    key: SettingKey
    value: string
}

export class CoursesFolderDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreateOrUpdateSettingParams) {
        return await this.#prisma.setting.create({ data })
    }

    async get<T extends string>(key: SettingKey): Promise<T | null> {
        const result = await this.#prisma.setting.findFirst({ where: { key } })
        return result ? result.value as T : null
    }

    async update({ key, value }: CreateOrUpdateSettingParams): Promise<Setting> {
        return await this.#prisma.setting.update({
            where: { key },
            data: { value }
        })
    }

    async delete(key: SettingKey): Promise<void> {
        await this.#prisma.setting.delete({ where: { key } })
    }
}
