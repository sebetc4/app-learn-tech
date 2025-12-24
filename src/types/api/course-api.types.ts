import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerReturn,
    GetRecentCoursesIPCHandlerParams,
    GetRecentCoursesIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn,
    UploadOneCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerReturn
} from '../ipc'

export interface IntegrityCheckResult {
    totalChecked: number
    deactivated: number
    deactivatedCourseIds: string[]
}

export interface CourseAPI {
    addOne: (params: AddOneCourseIPCHandlerParams) => AddOneCourseIPCHandlerReturn
    getOne: (params: GetOneCourseIPCHandlerParams) => GetOneCourseIPCHandlerReturn
    getRecent: (params: GetRecentCoursesIPCHandlerParams) => GetRecentCoursesIPCHandlerReturn
    getAll: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    getInactive: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    uploadOne: (params: UploadOneCourseIPCHandlerParams) => UploadOneCourseIPCHandlerReturn
    removeOne: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
    hardDelete: (params: { courseId: string }) => RemoveCourseIPCHandlerReturn
    onIntegrityCheckComplete: (callback: (result: IntegrityCheckResult) => void) => void
    removeIntegrityCheckListener: () => void
}
