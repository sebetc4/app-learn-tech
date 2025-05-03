import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerParams,
    RemoveCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerParams
} from '@/types'

export const courseContextBridge = {
    getOne: (params: GetOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.GET_ONE, params),
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    addOne: (params: AddOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.CREATE_ONE, params),
    uploadOne: (params: UploadOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.UPDATE_ONE, params),
    removeOne: (params: RemoveCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.REMOVE_ONE, params)
}
