import { ChapterMetadata } from './chapter-metadata.types'

export interface CourseMetadata {
    id: string
    name: string
    description: string
    chapters: ChapterMetadata[]
}

export interface CourseMetadataAndPath {
    metadata: CourseMetadata
    path: string
}
