import { Course } from '@prisma/client'

export interface CourseViewModel extends Course {
    chapters: {
        id: string
        position: number
        name: string
        lessons: {
            id: string
            position: number
            name: string
            type: string
        }[]
    }[]
}

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description' | 'iconPath' | 'buildAt'>
