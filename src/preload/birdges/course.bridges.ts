import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    RemoveCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerParams
} from '@/types'

export const courseContextBridge = {
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    importArchive: () => ipcRenderer.invoke(IPC.COURSE.IMPORT_ARCHIVE),
    addOne: (params: AddOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.ADD_ONE, params),
    uploadOne: (params: UploadOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.UPLOAD_ONE, params),
    removeOne: (params: RemoveCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.REMOVE_ONE, params)
}
