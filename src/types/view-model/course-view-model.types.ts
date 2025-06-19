import { Course } from '../database'

import type { LessonType, ProgressLessonViewModel } from '@/types'

export interface LessonInCourseViewModel {
    id: string
    position: number
    name: string
    type: LessonType
    videoDuration: number | null
    lessonProgresses: ProgressLessonViewModel[]
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
