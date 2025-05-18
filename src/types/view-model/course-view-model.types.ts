import { Course, LessonType } from '@prisma/client'

export interface CourseViewModel extends Course {
    chapters: {
        id: string
        position: number
        name: string
        lessons: {
            id: string
            position: number
            name: string
            type: LessonType
            videoDuration: number | null
        }[]
    }[]
}

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description' | 'folderName' | 'buildAt'>
