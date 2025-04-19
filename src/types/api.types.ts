import { CoursePreviewData } from './dto'
import { IPCHandlerReturn } from './ipc.types'

export interface CourseAPI {
    getAll: () => Promise<IPCHandlerReturn<{ coursePreviewData: CoursePreviewData }>>
    import: () => Promise<IPCHandlerReturn<void>>
    remove: (courseId: string) => Promise<IPCHandlerReturn<void>>
}

export interface mediaAPI {
    getVideoPath: (courseId: string, lessonId: string) => IPCHandlerReturn<{ path: string }>
    getCodeSnippetContent: (
        courseId: string,
        lessonId: string,
        snippetId: string,
        extension: string
    ) => Promise<IPCHandlerReturn<{ codeSnippetContent: string }>>
    checkDiskSpace: () => Promise<IPCHandlerReturn<{ availableSpace: number }>>
    getCourseSize: (courseId: string) => Promise<IPCHandlerReturn<{ size: number }>>
}

export interface ThemeAPI {
    get: () => IPCHandlerReturn<{ theme: ThemeValue }>
    set: (value: ThemeValue) => IPCHandlerReturn<void>
    toggle: () => IPCHandlerReturn<void>
}

export interface AppAPI {
    course: CourseAPI
    media: mediaAPI
    theme: ThemeAPI
}
