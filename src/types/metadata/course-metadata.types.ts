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

type ScannedCourseType = 'import' | 'update'

export interface ScannedCourse {
    metadata: CourseMetadata
    directory: string
    type: ScannedCourseType
}
