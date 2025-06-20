import type { Lesson } from '../database'
import { CodeSnippetViewModel } from './code-snippet-view-model.types'
import type { LessonProgressViewModel } from './progress-view-model.types'
import { ResourceViewModel } from './resource-view-model.types'

export interface LessonViewModel extends Lesson {
    codeSnippets: CodeSnippetViewModel[]
    resources: ResourceViewModel[]
    progress: LessonProgressViewModel | null
}
