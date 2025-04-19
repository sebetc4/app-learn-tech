import { LessonType } from '@prisma/client'
import { CodeSnippetArchive } from './code-snippet-archive.types'
import { ResourceArchive } from './resources-archive.types'

export interface LessonArchive {
    id: string
    position: number
    name: string

    type: LessonType

    codeSnippets: CodeSnippetArchive[]
    resources: ResourceArchive[]
}
