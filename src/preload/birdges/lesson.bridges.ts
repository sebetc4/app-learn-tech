import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import { GetJSXLessonContentIPCHandlerParams, GetOneLessonIPCHandlerParams } from '@/types'

export const lessonContextBridge = {
    getOne: (params: GetOneLessonIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.LESSON.GET_ONE, params),
    getNavigationElement: (params: { courseId: string; chapterId: string }) =>
        ipcRenderer.invoke(IPC.LESSON.GET_NAVIGATION_ELEMENT, params),
    getJSXContent: (params: GetJSXLessonContentIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.LESSON.GET_JSX_CONTENT, params)
}
