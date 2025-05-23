import type { LessonProgressStatus } from '@prisma/client'

export interface ProgressLessonViewModel {
    id: string
    status: LessonProgressStatus
}
