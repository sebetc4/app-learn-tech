import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import {
    GetCodeSnippetContentParams,
    GetCourseSizeIPCHandlerParams,
    GetVideoPathIPCHandlerParams
} from '@/types'

export const mediaContextBridge = {
    getVideoPath: (params: GetVideoPathIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.MEDIA.GET_VIDEO_PATH, params),
    getCodeSnippetContent: (params: GetCodeSnippetContentParams) =>
        ipcRenderer.invoke(IPC.MEDIA.GET_CODE_SNIPPET, params),
    checkDiskSpace: () => ipcRenderer.invoke(IPC.MEDIA.CHECK_DISK_SPACE),
    getCourseSize: (params: GetCourseSizeIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.MEDIA.GET_COURSE_SIZE, params)
}
