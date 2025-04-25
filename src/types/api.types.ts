import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    CheckDiskSpaceIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetCodeSnippetContentIPCHandlerReturn,
    GetCodeSnippetContentParams,
    GetCourseSizeIPCHandlerParams,
    GetCourseSizeIPCHandlerReturn,
    GetCoursesRootFolderIPCHandlerReturn,
    GetThemeIPCHandlerReturn,
    GetVideoPathIPCHandlerParams,
    GetVideoPathIPCHandlerReturn,
    ImportCourseArchiveIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn,
    RemoveRootFolderIPCHandlerReturn,
    ScanRootFolderIPCHandlerReturn,
    SetCoursesRootFolderIPCHandlerReturn,
    SetThemeIPCHandlerParams,
    SetThemeIPCHandlerReturn,
    ToggleThemeIPCHandlerReturn
} from './ipc'

export interface FolderAPI {
    // Root
    getRoot: () => GetCoursesRootFolderIPCHandlerReturn
    setRoot: () => SetCoursesRootFolderIPCHandlerReturn
    removeRoot: () => RemoveRootFolderIPCHandlerReturn
    // Archive
    importArchive: () => ImportCourseArchiveIPCHandlerReturn
    // Scan
    scan: () => ScanRootFolderIPCHandlerReturn
}

export interface CourseAPI {
    getAll: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    addOne: (params: AddOneCourseIPCHandlerParams) => AddOneCourseIPCHandlerReturn
    removeOne: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
}

export interface MediaAPI {
    getVideoPath: (params: GetVideoPathIPCHandlerParams) => GetVideoPathIPCHandlerReturn
    getCodeSnippetContent: (
        params: GetCodeSnippetContentParams
    ) => GetCodeSnippetContentIPCHandlerReturn
    checkDiskSpace: () => CheckDiskSpaceIPCHandlerReturn
    getCourseSize: (params: GetCourseSizeIPCHandlerParams) => GetCourseSizeIPCHandlerReturn
}

export interface ThemeAPI {
    get: () => GetThemeIPCHandlerReturn
    set: (params: SetThemeIPCHandlerParams) => SetThemeIPCHandlerReturn
    toggle: () => ToggleThemeIPCHandlerReturn
}

export interface AppAPI {
    course: CourseAPI
    folder: FolderAPI
    media: MediaAPI
    theme: ThemeAPI
}
