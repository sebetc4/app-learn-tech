import { ChapterMetadata } from './chapter-metadata.types'
import { CoursePreview } from '../view-model/course-view-model.types'

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

export interface DuplicateCheckResult {
    canImport: boolean
    action: 'import' | 'reactivate' | 'reject'
    existingCourse?: CoursePreview
    message: string
}
