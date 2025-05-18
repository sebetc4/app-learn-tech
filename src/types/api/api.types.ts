import type { CourseAPI } from './course-api.types'
import type { FolderAPI } from './folder-api.types'
import type { LessonAPI } from './lesson-api.types'
import type { ThemeAPI } from './theme-api.types'

export interface AppAPI {
    course: CourseAPI
    folder: FolderAPI
    lesson: LessonAPI
    theme: ThemeAPI
}
