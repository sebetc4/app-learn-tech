import type {
    GetCoursesRootFolderIPCHandlerReturn,
    GetDiskSpaceIPCHandlerReturn,
    ImportCourseArchiveIPCHandlerReturn,
    RemoveRootFolderIPCHandlerReturn,
    ScanRootFolderIPCHandlerReturn,
    SetCoursesRootFolderIPCHandlerReturn
} from '../ipc'

export interface FolderAPI {
    getRoot: () => GetCoursesRootFolderIPCHandlerReturn
    setRoot: () => SetCoursesRootFolderIPCHandlerReturn
    removeRoot: () => RemoveRootFolderIPCHandlerReturn
    getDiskSpace: () => GetDiskSpaceIPCHandlerReturn
    scan: () => ScanRootFolderIPCHandlerReturn
    importArchive: () => ImportCourseArchiveIPCHandlerReturn
    onImportArchiveStart: (callback: () => void) => void
    onImportArchiveProgress: (callback: (progress: number) => void) => void
    removeImportArchiveProgressListener: () => void
}
