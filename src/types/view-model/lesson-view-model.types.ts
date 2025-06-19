import { CodeSnippet, Lesson, Resource } from '../database'
import type { ProgressLessonViewModel } from './progress-view-model.types'

export interface LessonViewModel extends Lesson {
    codeSnippets: Pick<CodeSnippet, 'id' | 'position' | 'language' | 'extension'>[]
    resources: Pick<Resource, 'id' | 'type' | 'url'>[]
    lessonProgresses: ProgressLessonViewModel[]
}
