import { CoursePreviewData } from '../dto'
import { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

export type GetAllCourseIPCHandlerReturn = Promise<
    IPCHandlerReturnWithData<{ courses: CoursePreviewData }>
>

export type ImportCourseIPCHandlerReturn = Promise<IPCHandlerReturnWithData<{ courseId: string }>>

export type RemoveCourseIPCHandlerParams = {
    courseId: string
}
export type RemoveCourseIPCHandlerReturn = Promise<IPCHandlerReturnWithoutData>
