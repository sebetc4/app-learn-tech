import type { CoursesFolderService, DatabaseService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn
} from '@/types'

export const registerCourseIpcHandlers = (
    database: DatabaseService,
    courseFolderService: CoursesFolderService
) => {
    ipcMain.handle(IPC.COURSE.GET_ALL, async (): GetAllAlreadyImportedCourseIPCHandlerReturn => {
        const courses = await database.course.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Cours récupérés avec succès'
        }
    })

    ipcMain.handle(
        IPC.COURSE.ADD_ONE,
        async (
            _event,
            { courseDirName }: AddOneCourseIPCHandlerParams
        ): AddOneCourseIPCHandlerReturn => {
            try {
                const courseId = await courseFolderService.addOneCourse(courseDirName)
                return {
                    success: true,
                    data: { courseId },
                    message: 'Cours importé avec succès'
                }
            } catch (error) {
                console.error('Error durring import course:', error)
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
                await courseFolderService.removeCourse(courseDirName)
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
