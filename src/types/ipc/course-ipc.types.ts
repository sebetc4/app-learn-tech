import { CoursePreview, CourseViewModel, RecentCourseViewModel } from '../view-model'
import type { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

// Add one course
export type AddOneCourseIPCHandlerParams = {
    courseDirName: string
}
export type AddOneCourseIPCHandlerReturn = IPCHandlerReturnWithData<{ course: CoursePreview }>

// Get One
export type GetOneCourseIPCHandlerParams = {
    courseId: string
    userId: string
}

export type GetOneCourseIPCHandlerReturn = IPCHandlerReturnWithData<{
    course: CourseViewModel
}>

// Get Recent
export type GetRecentCoursesIPCHandlerParams = {
    userId: string
}

export type GetRecentCoursesIPCHandlerReturn = IPCHandlerReturnWithData<{
    courses: RecentCourseViewModel[]
}>

// Get all courses
export type GetAllAlreadyImportedCourseIPCHandlerReturn = IPCHandlerReturnWithData<{
    courses: CoursePreview[]
}>

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
