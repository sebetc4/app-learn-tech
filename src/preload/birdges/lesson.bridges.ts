import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type {
    GetCodeSnippetContentIPCHandlerParams,
    GetJSXLessonContentIPCHandlerParams,
    GetLessonDataIPCHandlerParams,
    LessonAPI
} from '@/types'

export const lessonContextBridge: LessonAPI = {
    getData: (params: GetLessonDataIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.LESSON.GET_DATA, params),
    getJSXContent: (params: GetJSXLessonContentIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.LESSON.GET_JSX_CONTENT, params),
    getCodeSnippetContent: (params: GetCodeSnippetContentIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.LESSON.GET_CODE_SNIPPET_CONTENT, params)
}
