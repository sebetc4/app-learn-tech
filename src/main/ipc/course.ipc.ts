import type { CourseService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetOneCourseIPCHandlerParams,
    GetOneCourseIPCHandlerReturn,
    GetRecentCoursesIPCHandlerParams,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn
} from '@/types'

export const registerCourseIpcHandlers = (courseService: CourseService) => {
    ipcMain.handle(
        IPC.COURSE.CREATE_ONE,
        async (
            _event,
            { courseDirName }: AddOneCourseIPCHandlerParams
        ): AddOneCourseIPCHandlerReturn => {
            try {
                const course = await courseService.create(courseDirName, 'directory')
                return {
                    success: true,
                    data: { course },
                    message: 'Course added successfully'
                }
            } catch (error) {
                console.error('Error during import course:', error)
                return {
                    success: false,
                    message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.COURSE.GET_ONE,
        async (
            _event,
            { courseId, userId }: GetOneCourseIPCHandlerParams
        ): GetOneCourseIPCHandlerReturn => {
            try {
                const course = await courseService.getOne(courseId, userId)
                return {
                    success: true,
                    data: { course },
                    message: 'Course retrieved successfully'
                }
            } catch (error) {
                console.error('Error during import course:', error)
                return {
                    success: false,
                    message: `Error retrieving course: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.COURSE.GET_RECENT,
        async (_event, { userId }: GetRecentCoursesIPCHandlerParams) => {
            try {
                const courses = await courseService.getRecentCourses(userId)
                return {
                    success: true,
                    data: { courses },
                    message: 'Recent courses retrieved successfully'
                }
            } catch (error) {
                console.error('Error retrieving recent courses:', error)
                return {
                    success: false,
                    message: `Error retrieving recent courses: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )

    ipcMain.handle(IPC.COURSE.GET_ALL, async (): GetAllAlreadyImportedCourseIPCHandlerReturn => {
        const courses = await courseService.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Courses retrieved successfully'
        }
    })

    ipcMain.handle(
        IPC.COURSE.REMOVE_ONE,
        async (
            _event,
            { courseDirName }: RemoveCourseIPCHandlerParams
        ): RemoveCourseIPCHandlerReturn => {
            try {
                await courseService.removeOne(courseDirName)
                return { success: true, message: 'Course deleted successfully' }
            } catch (error) {
                console.error('Error during course deletion:', error)
                return {
                    success: false,
                    message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
                }
            }
        }
    )
}
