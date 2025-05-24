import { PrismaClient, Theme } from '@prisma/client'

import { UserViewModelWithoutTheme } from '@/types'

interface CreateUserParams {
    name: string
}

export class UserDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreateUserParams) {
        return this.#prisma.user.create({ data })
    }
    async getById(id: string) {
        return this.#prisma.user.findUnique({ where: { id } })
    }

    async getAll(): Promise<UserViewModelWithoutTheme[]> {
        return this.#prisma.user.findMany({
            select: {
                id: true,
                name: true
            }
        })
    }

    async updateTheme(id: string, theme: Theme) {
        return await this.#prisma.user.update({
            where: { id },
            data: { theme }
        })
    }

    async createDefaultUserIfNoneExist() {
        const users = await this.getAll()
        if (users.length === 0) {
            const user = await this.create({ name: 'Default' })
            return user
        }
        return null
    }
}
