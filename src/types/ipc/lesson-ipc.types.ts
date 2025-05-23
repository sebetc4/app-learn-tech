import { LessonViewModel } from '../view-model'
import type { IPCHandlerReturnWithData } from './core-ipc.types'

// Get One
export type GetLessonStoreDataIPCHandlerParams = {
    courseId: string
    chapterId: string
    lessonId: string
    userId: string
}

interface AdjacentLesson {
    id: string
    chapterId: string
    position: number
    name: string
}

export type GetLessonStoreDataIPCHandlerReturn = IPCHandlerReturnWithData<{
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
        previous: AdjacentLesson | null
        next: AdjacentLesson | null
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
