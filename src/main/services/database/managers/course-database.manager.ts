import { Course, PrismaClient } from '@prisma/client'

import { CoursePreview, CourseViewModel } from '@/types'

interface CreateCourseParams {
    id: string
    name: string
    description: string
    folderName: string
    buildAt: string
}

interface GetByIdParams {
    courseId: string
    userId: string
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
                folderName: true,
                buildAt: true
            }
        })
    }

    getById(id: string): Promise<Course | null> {
        try {
            return this.#prisma.course.findUnique({
                where: { id }
            })
        } catch (error) {
            console.error(`Error retrieving course by ID: ${error}`)
            throw error
        }
    }

    async getCourseViewModelById({
        courseId,
        userId
    }: GetByIdParams): Promise<CourseViewModel | null> {
        return await this.#prisma.course.findUnique({
            where: { id: courseId },
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
                                videoDuration: true,
                                type: true,
                                lessonProgress: {
                                    where: { userId },
                                    select: {
                                        id: true,
                                        status: true
                                    }
                                }
                            }
                        }
                    }
                },
                courseProgresses: {
                    where: { userId, courseId },
                    select: {
                        percentage: true
                    }
                }
            }
        })
    }

    async getOneById(id: string): Promise<Course> {
        try {
            const course = await this.#prisma.course.findUnique({ where: { id } })
            if (!course) {
                throw new Error(`Course with ID ${id} not found`)
            }
            return course
        } catch (error) {
            console.error(`Error retrieving course by ID: ${error}`)
            throw error
        }
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
