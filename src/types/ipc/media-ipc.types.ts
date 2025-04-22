import { IPCHandlerReturnWithData } from './core-ipc.types'

export type GetVideoPathIPCHandlerParams = {
    courseId: string
    lessonId: string
}
export type GetVideoPathIPCHandlerReturn = Promise<IPCHandlerReturnWithData<{ path: string }>>

export type GetCodeSnippetContentParams = {
    courseId: string
    lessonId: string
    snippetId: string
    extension: string
}
export type GetCodeSnippetContentIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ codeSnippetContent: string }>
>

export type CheckDiskSpaceIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ availableSpace: number }>
>

export type GetCourseSizeIPCHandlerParams = {
    courseId: string
}
export type GetCourseSizeIPCHandlerReturn = Promise<IPCHandlerReturnWithData<{ size: number }>>
