import { CodeSnippet, PrismaClient } from '@prisma/client'

interface CreateCodeSnippetParams {
    id: string
    position: number
    language: string
    extension: string

    lessonId: string
}

export class CodeSnippetDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreateCodeSnippetParams): Promise<CodeSnippet> {
        return await this.#prisma.codeSnippet.create({ data })
    }
}
