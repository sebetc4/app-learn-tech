import { LessonViewModel } from '../view-model'
import type { IPCHandlerReturnWithData } from './core-ipc.types'

// Get One
export type GetLessonDataIPCHandlerParams = {
    courseId: string
    chapterId: string
    lessonId: string
}

export type GetLessonDataIPCHandlerReturn = IPCHandlerReturnWithData<{
    course: {
        id: string
        name: string
    }
    chapter: {
        id: string
        name: string
        position: number
    }
    lesson: LessonViewModel
    adjacentLessons: {
        previous: {
            id: string
            position: number
        } | null
        next: {
            id: string
            position: number
        } | null
    }
}>

// Get MDX Content
export type GetJSXLessonContentIPCHandlerParams = {
    courseId: string
    chapterId: string
    lessonId: string
}

export type GetJSXLessonContentIPCHandlerReturn = IPCHandlerReturnWithData<{
    jsxContent: string
    dependencies: {
        [key: string]: string
    }
}>

export type GetCodeSnippetContentIPCHandlerParams = {
    courseId: string
    chapterId: string
    lessonId: string
    codeSnippetId: string
    codeSnippetExtension: string
}

export type GetCodeSnippetContentIPCHandlerReturn = IPCHandlerReturnWithData<{
    content: string
}>
