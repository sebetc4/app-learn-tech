import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetCoursesRootFolderIPCHandlerReturn,
    GetThemeIPCHandlerReturn,
    ImportCourseArchiveIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn,
    RemoveRootFolderIPCHandlerReturn,
    ScanRootFolderIPCHandlerReturn,
    SetCoursesRootFolderIPCHandlerReturn,
    SetThemeIPCHandlerParams,
    SetThemeIPCHandlerReturn,
    ToggleThemeIPCHandlerReturn,
    UploadOneCourseIPCHandlerParams,
    UploadOneCourseIPCHandlerReturn
} from './ipc'

export interface FolderAPI {
    getRoot: () => GetCoursesRootFolderIPCHandlerReturn
    setRoot: () => SetCoursesRootFolderIPCHandlerReturn
    removeRoot: () => RemoveRootFolderIPCHandlerReturn
    scan: () => ScanRootFolderIPCHandlerReturn
}

export interface CourseAPI {
    getAll: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    importArchive: () => ImportCourseArchiveIPCHandlerReturn
    addOne: (params: AddOneCourseIPCHandlerParams) => AddOneCourseIPCHandlerReturn
    uploadOne: (params: UploadOneCourseIPCHandlerParams) => UploadOneCourseIPCHandlerReturn
    removeOne: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
}

export interface ThemeAPI {
    get: () => GetThemeIPCHandlerReturn
    set: (params: SetThemeIPCHandlerParams) => SetThemeIPCHandlerReturn
    toggle: () => ToggleThemeIPCHandlerReturn
}

export interface AppAPI {
    course: CourseAPI
    folder: FolderAPI
    theme: ThemeAPI
}
