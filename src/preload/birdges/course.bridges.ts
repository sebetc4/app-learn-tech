import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type { RemoveCourseIPCHandlerParams } from '@/types'

export const courseContextBridge = {
    selectCoursesRootFolder: () => ipcRenderer.invoke(IPC.COURSE.SELECT_COURSES_ROOT_FOLDER),
    scanCourses: () => ipcRenderer.invoke(IPC.COURSE.SCAN_COURSES),
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    import: () => ipcRenderer.invoke(IPC.COURSE.IMPORT),
    remove: (params: RemoveCourseIPCHandlerParams) => ipcRenderer.invoke(IPC.COURSE.REMOVE, params)
}
