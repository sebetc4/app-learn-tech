import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    CourseAPI,
    GetOneCourseIPCHandlerParams,
    GetRecentCoursesIPCHandlerParams,
    IntegrityCheckResult,
    RemoveCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerParams
} from '@/types'

export const courseContextBridge: CourseAPI = {
    addOne: (params: AddOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.CREATE_ONE, params),
    getOne: (params: GetOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.GET_ONE, params),
    getRecent: (params: GetRecentCoursesIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.GET_RECENT, params),
    getAll: () => ipcRenderer.invoke(IPC.COURSE.GET_ALL),
    uploadOne: (params: UploadOneCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.UPDATE_ONE, params),
    removeOne: (params: RemoveCourseIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.COURSE.REMOVE_ONE, params),
    getInactive: () => ipcRenderer.invoke(IPC.COURSE.GET_INACTIVE),
    hardDelete: (params: { courseId: string }) =>
        ipcRenderer.invoke(IPC.COURSE.HARD_DELETE, params),
    onIntegrityCheckComplete: (callback: (result: IntegrityCheckResult) => void) => {
        ipcRenderer.on(IPC.COURSE.INTEGRITY_CHECK_COMPLETE, (_, result) => callback(result))
    },
    removeIntegrityCheckListener: () => {
        ipcRenderer.removeAllListeners(IPC.COURSE.INTEGRITY_CHECK_COMPLETE)
    }
}
