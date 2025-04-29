import { Course, PrismaClient } from '@prisma/client'

import { CoursePreview, CourseViewModel } from '@/types'

interface CreateCourseParams {
    id: string
    name: string
    description: string
    iconPath: string
    buildAt: string
}

export class CourseDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreateCourseParams): Promise<Course> {
        return await this.#prisma.course.create({ data })
    }

    async getAll(): Promise<CoursePreview[]> {
        return await this.#prisma.course.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                iconPath: true,
                buildAt: true
            }
        })
    }

    async getById(id: string): Promise<CourseViewModel | null> {
        return await this.#prisma.course.findUnique({
            where: { id },
            include: {
                chapters: {
                    select: {
                        id: true,
                        position: true,
                        name: true,
                        lessons: {
                            select: {
                                id: true,
                                position: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                }
            }
        })
    }

    async getByName(name: string): Promise<Course | null> {
        return await this.#prisma.course.findUnique({
            where: { name }
        })
    }

    async deleteById(id: string): Promise<Course | null> {
        return await this.#prisma.course.delete({
            where: { id }
        })
    }
}
