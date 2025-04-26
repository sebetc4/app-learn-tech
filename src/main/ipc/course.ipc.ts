import type { CourseService } from '../services'
import { IPC } from '@/constants'
import { dialog, ipcMain } from 'electron'

import type {
    AddOneCourseIPCHandlerParams,
    AddOneCourseIPCHandlerReturn,
    GetAllAlreadyImportedCourseIPCHandlerReturn,
    ImportCourseArchiveIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn
} from '@/types'

export const registerCourseIpcHandlers = (
    courseService: CourseService
) => {
    ipcMain.handle(IPC.COURSE.GET_ALL, async (): GetAllAlreadyImportedCourseIPCHandlerReturn => {
        const courses = await courseService.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Cours récupérés avec succès'
        }
    })

    ipcMain.handle(IPC.COURSE.IMPORT_ARCHIVE, async (): ImportCourseArchiveIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner un fichier de cours (.zip)',
                filters: [{ name: 'Archives ZIP', extensions: ['zip'] }],
                properties: ['openFile']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Aborted operation' }
            }
            const courseId = await courseService.importCourseArchive(filePaths[0])

            return {
                success: true,
                data: { courseId },
                message: 'Course imported successfully'
            }
        } catch (error) {
            console.error('Error durring import course:', error)
            return {
                success: false,
                message: `Error during import: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(
        IPC.COURSE.ADD_ONE,
        async (
            _event,
            { courseDirName }: AddOneCourseIPCHandlerParams
        ): AddOneCourseIPCHandlerReturn => {
            try {
                const courseId = await courseService.addOne(courseDirName)
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
