import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import { GetOneLessonIPCHandlerParams } from '@/types'

export const lessonContextBridge = {
    getOne: (params: GetOneLessonIPCHandlerParams) => ipcRenderer.invoke(IPC.LESSON.GET_ONE, params)
}
