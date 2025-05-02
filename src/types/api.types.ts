import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetCoursesRootFolderIPCHandlerReturn,
    GetNavigationElementIPCHandlerParams,
    GetOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerReturn,
    GetOneLessonIPCHandlerParams,
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
import { GetOneLessonIPCHandlerReturn } from './ipc/lesson-ipc.types'

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
    ) => GetOneLessonIPCHandlerReturn
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
