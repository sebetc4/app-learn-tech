import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn,
    UploadOneCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerReturn
} from '../ipc'

export interface CourseAPI {
    getOne: (params: GetOneCourseIPCHandlerParams) => GetOneCourseIPCHandlerReturn
    getAll: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    addOne: (params: AddOneCourseIPCHandlerParams) => AddOneCourseIPCHandlerReturn
    uploadOne: (params: UploadOneCourseIPCHandlerParams) => UploadOneCourseIPCHandlerReturn
    removeOne: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
}
