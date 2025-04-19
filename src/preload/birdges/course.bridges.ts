import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

export const courseContextBridge = {
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    import: (filePath: string) => ipcRenderer.invoke(IPC.COURSE.IMPORT, filePath),
    remove: (courseId: string) => ipcRenderer.invoke(IPC.COURSE.REMOVE, courseId)
}
