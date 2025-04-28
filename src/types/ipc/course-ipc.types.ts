import { CoursePreview } from '../dto'
import type { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

// Import course archive
export type ImportCourseArchiveIPCHandlerReturn = IPCHandlerReturnWithData<{
    course: CoursePreview
}>

// Get all courses
export type GetAllAlreadyImportedCourseIPCHandlerReturn = IPCHandlerReturnWithData<{
    courses: CoursePreview[]
}>

// Add one course
export type AddOneCourseIPCHandlerParams = {
    courseDirName: string
}
export type AddOneCourseIPCHandlerReturn = IPCHandlerReturnWithData<{ course: CoursePreview }>

// Add all courses
export type AddAllCoursesIPCHandlerReturn = IPCHandlerReturnWithData<{
    courseDirNames: string[]
}>

// Upload one course
export type UploadOneCourseIPCHandlerParams = {
    courseDirName: string
}

export type UploadOneCourseIPCHandlerReturn = IPCHandlerReturnWithData<{ course: CoursePreview }>

// Remove one course
export type RemoveCourseIPCHandlerParams = {
    courseDirName: string
}
export type RemoveCourseIPCHandlerReturn = IPCHandlerReturnWithoutData
