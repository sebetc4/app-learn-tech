import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetCoursesRootFolderIPCHandlerReturn,
    GetJSXLessonContentIPCHandlerParams,
    GetJSXLessonContentIPCHandlerReturn,
    GetNavigationElementIPCHandlerParams,
    GetNavigationElementIPCHandlerReturn,
    GetOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerReturn,
    GetOneLessonIPCHandlerParams,
    GetOneLessonIPCHandlerReturn,
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
    importArchive: () => ImportCourseArchiveIPCHandlerReturn
}

export interface CourseAPI {
    getOne: (params: GetOneCourseIPCHandlerParams) => GetOneCourseIPCHandlerReturn
    getAll: () => GetAllAlreadyImportedCourseIPCHandlerReturn
    addOne: (params: AddOneCourseIPCHandlerParams) => AddOneCourseIPCHandlerReturn
    uploadOne: (params: UploadOneCourseIPCHandlerParams) => UploadOneCourseIPCHandlerReturn
    removeOne: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
}

export interface LessonAPI {
    getOne: (params: GetOneLessonIPCHandlerParams) => GetOneLessonIPCHandlerReturn
    getNavigationElement: (
        params: GetNavigationElementIPCHandlerParams
    ) => GetNavigationElementIPCHandlerReturn
    getJSXContent: (
        params: GetJSXLessonContentIPCHandlerParams
    ) => GetJSXLessonContentIPCHandlerReturn
}

export interface ThemeAPI {
    get: () => GetThemeIPCHandlerReturn
    set: (params: SetThemeIPCHandlerParams) => SetThemeIPCHandlerReturn
    toggle: () => ToggleThemeIPCHandlerReturn
}

export interface AppAPI {
    course: CourseAPI
    folder: FolderAPI
    lesson: LessonAPI
    theme: ThemeAPI
}
