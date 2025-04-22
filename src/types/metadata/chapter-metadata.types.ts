import { LessonMetadata } from './lesson-metadata.types'

export interface ChapterMetadata {
    id: string
    position: number
    name: string
    lessons: LessonMetadata[]
}
