import { ChapterMetadata } from './chapter-metadata.types'

export interface CourseMetadata {
    id: string
    name: string
    description: string
    buildAt: string
    chapters: ChapterMetadata[]
}

export interface CourseMetadataAndDirectory {
    metadata: CourseMetadata
    directory: string
}

