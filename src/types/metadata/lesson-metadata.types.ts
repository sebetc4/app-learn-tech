import { LessonType } from '@prisma/client'
import { CodeSnippetMetadata } from './code-snippet-metadata.types'
import { ResourceMetadata } from './resources-metadata.types'

export interface LessonMetadata {
    id: string
    position: number
    name: string

    type: LessonType

    codeSnippets: CodeSnippetMetadata[]
    resources: ResourceMetadata[]
}
