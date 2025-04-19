import { LessonArchive } from './lesson-archive.types'

export interface ChapterArchive {
    id: string
    position: number
    name: string
    lessons: LessonArchive[]
}
