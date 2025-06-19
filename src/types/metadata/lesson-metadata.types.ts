import { CodeSnippetMetadata } from './code-snippet-metadata.types'
import { ResourceMetadata } from './resources-metadata.types'
import { LessonType } from '@/types'

export interface LessonMetadata {
    id: string
    position: number
    name: string

    type: LessonType

    videoDuration?: number

    codeSnippets: CodeSnippetMetadata[]
    resources: ResourceMetadata[]
}
