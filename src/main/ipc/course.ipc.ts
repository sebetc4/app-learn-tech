import type { CourseService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    GetOneCourseIPCHandlerParams,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn
} from '@/types'

export const registerCourseIpcHandlers = (courseService: CourseService) => {
    ipcMain.handle(
        IPC.COURSE.GET_ONE,
        async (
            _event,
            { courseId }: GetOneCourseIPCHandlerParams
        ): AddOneCourseIPCHandlerReturn => {
            try {
                const course = await courseService.getOne(courseId)
                return {
                    success: true,
                    data: { course },
                    message: 'Cours récupéré avec succès'
                }
            } catch (error) {
                console.error('Error during import course:', error)
                return {
                    success: false,
                    message: `Erreur lors de la récupération du cours`
                }
            }
        }
    )

    ipcMain.handle(IPC.COURSE.GET_ALL, async (): GetAllAlreadyImportedCourseIPCHandlerReturn => {
        const courses = await courseService.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Cours récupérés avec succès'
        }
    })

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
                    message: 'Cours importé avec succès'
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
