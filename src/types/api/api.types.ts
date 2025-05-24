import type { CourseAPI } from './course-api.types'
import type { FolderAPI } from './folder-api.types'
import type { LessonAPI } from './lesson-api.types'
import { ProgressAPI } from './progress.types'
import { UserAPI } from './user-api'

export interface AppAPI {
    course: CourseAPI
    folder: FolderAPI
    lesson: LessonAPI
    progress: ProgressAPI
    user: UserAPI
}
