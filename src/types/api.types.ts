import type {
    CheckDiskSpaceIPCHandlerReturn,
    GetAllCourseIPCHandlerReturn,
    GetCodeSnippetContentIPCHandlerReturn,
    GetCodeSnippetContentParams,
    GetCourseSizeIPCHandlerParams,
    GetCourseSizeIPCHandlerReturn,
    GetThemeIPCHandlerReturn,
    GetVideoPathIPCHandlerParams,
    GetVideoPathIPCHandlerReturn,
    ImportCourseIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn,
    SetThemeIPCHandlerParams,
    SetThemeIPCHandlerReturn,
    ToggleThemeIPCHandlerReturn
} from './ipc'

export interface CourseAPI {
    getAll: () => GetAllCourseIPCHandlerReturn
    import: () => ImportCourseIPCHandlerReturn
    remove: (params: RemoveCourseIPCHandlerParams) => RemoveCourseIPCHandlerReturn
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
    media: MediaAPI
    theme: ThemeAPI
}
