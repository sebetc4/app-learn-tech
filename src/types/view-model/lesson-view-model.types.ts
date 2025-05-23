import type { ProgressLessonViewModel } from './progress-view-model.types'
import type { CodeSnippet, Lesson, Resource } from '@prisma/client'

export interface LessonViewModel extends Lesson {
    codeSnippets: Pick<CodeSnippet, 'id' | 'position' | 'language' | 'extension'>[]
    resources: Pick<Resource, 'id' | 'type' | 'url'>[]
    lessonProgress: ProgressLessonViewModel[]
}
