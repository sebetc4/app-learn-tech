import type { CoursePreviewData } from '../dto'
import { CourseMetadata } from '../metadata'
import type { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

/**
 * --------------------------------
 * Root folder
 * --------------------------------
 */
// Get root folder
export type GetCoursesRootFolderIPCHandlerReturn = IPCHandlerReturnWithData<{ path: string | null }>

// Set root folder
export type SetCoursesRootFolderIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ path: string }>
>
// Remove root folder
export type RemoveRootFolderIPCHandlerReturn = Promise<IPCHandlerReturnWithoutData>

/**
 * --------------------------------
 * Archive
 * --------------------------------
 */
export type ImportCourseArchiveIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ courseId: string }>
>

/**
 * --------------------------------
 * Scan
 * --------------------------------
 */
export type ScanRootFolderIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{
        courses: {
            metadata: CourseMetadata
            path: string
        }[]
    }>
>

/**
 * --------------------------------
 * CRUD
 * --------------------------------
 */
// Get all already imported courses
export type GetAllAlreadyImportedCourseIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ courses: CoursePreviewData }>
>

// Add one course
export type AddOneCourseIPCHandlerParams = {
    courseDirName: string
}
export type AddOneCourseIPCHandlerReturn = Promise<IPCHandlerReturnWithData<{ courseId: string }>>

// Add all courses
export type AddAllCoursesIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{
        courseDirNames: string[]
    }>
>

// Remove one course
export type RemoveCourseIPCHandlerParams = {
    courseDirName: string
}
export type RemoveCourseIPCHandlerReturn = Promise<IPCHandlerReturnWithoutData>
