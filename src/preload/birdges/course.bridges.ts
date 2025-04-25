import { IPC } from '@/constants'
import type { AddOneCourseIPCHandlerParams, RemoveCourseIPCHandlerParams } from '@/types'
import { ipcRenderer } from 'electron'

export const folderContextBridge = {
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    addOne: (params: AddOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.ADD_ONE, params),
    removeOne: (params: RemoveCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.REMOVE_ONE, params)
}