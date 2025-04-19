import { Resource, ResourceType, PrismaClient } from '@prisma/client'

interface CreatResourceParams {
    id: string
    type: ResourceType
    url: string

    lessonId: string
}

export class ResourceDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreatResourceParams): Promise<Resource> {
        return await this.#prisma.resource.create({ data })
    }
}
