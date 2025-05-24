import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type { GetOneCourseIPCHandlerParams } from '@/types'
import { ProgressAPI } from '@/types/api/progress.types'

export const progressContextBridge: ProgressAPI = {
    createLessonProgress: (params: GetOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.GET_ONE, params)
}
