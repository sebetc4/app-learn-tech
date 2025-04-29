import { ScannedCourse } from '../metadata'
import { CoursePreview } from '../view-model'
import { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

// Get root folder
export type GetCoursesRootFolderIPCHandlerReturn = IPCHandlerReturnWithData<{ path: string | null }>

// Set root folder
export type SetCoursesRootFolderIPCHandlerReturn = IPCHandlerReturnWithData<{ path: string }>

// Remove root folder
export type RemoveRootFolderIPCHandlerReturn = IPCHandlerReturnWithoutData

// Scan root folder
export type ScanRootFolderIPCHandlerReturn = IPCHandlerReturnWithData<{
    scannedCourses: ScannedCourse[]
}>

// Archive course
export type ImportCourseArchiveIPCHandlerReturn = IPCHandlerReturnWithData<{
    course: CoursePreview
}>
