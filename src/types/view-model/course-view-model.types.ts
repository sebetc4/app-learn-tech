import { Course } from '../database'

import type { LessonProgressViewModel, LessonType } from '@/types'

export interface LessonInCourseViewModel {
    id: string
    position: number
    name: string
    type: LessonType
    videoDuration: number | null
    progress: LessonProgressViewModel | null
}

export interface ChapterInCourseViewModel {
    id: string
    position: number
    name: string
    lessons: LessonInCourseViewModel[]
}

export interface CourseViewModel extends Course {
    chapters: ChapterInCourseViewModel[]
    progress: number | null
}

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description' | 'folderName' | 'buildAt'>

export interface RecentCourseViewModel {
    id: string
    name: string
    folderName: string
    accessedAt: Date
    progressPercentage: number
}

export interface CourseHistoryViewModel {
    recentCourses: RecentCourseViewModel[]
}
