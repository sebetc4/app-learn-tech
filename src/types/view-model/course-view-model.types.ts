import type { ProgressLessonViewModel } from './progress-view-model.types'
import type { Course, LessonType } from '@prisma/client'

export interface LessonInCourseViewModel {
    id: string
    position: number
    name: string
    type: LessonType
    videoDuration: number | null
    lessonProgress: ProgressLessonViewModel[]
}

export interface ChapterInCourseViewModel {
    id: string
    position: number
    name: string
    lessons: LessonInCourseViewModel[]
}

export interface CourseViewModel extends Course {
    chapters: ChapterInCourseViewModel[]
    courseProgresses: {
        percentage: number
    }[]
}

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description' | 'folderName' | 'buildAt'>
