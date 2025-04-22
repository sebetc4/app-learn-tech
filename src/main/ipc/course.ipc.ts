import { FolderCourseService } from '../services'
import { IPC } from '@/constants'
import { DatabaseService } from '@main/services/database'
import { dialog, ipcMain } from 'electron'

import {
    GetAllCourseIPCHandlerReturn,
    ImportCourseIPCHandlerReturn,
    RemoveCourseIPCHandlerParams,
    RemoveCourseIPCHandlerReturn
} from '@/types'

export const registerCourseIpcHandlers = (database: DatabaseService) => {
    const courseImporter = new FolderCourseService(database)

    ipcMain.handle(IPC.COURSE.ADD_COURSES_ROOT_FOLDER, async () => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner le dossier racine des cours',
                properties: ['openDirectory']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Opération annulée' }
            }

            const rootPath = filePaths[0]
            courseImporter.setCoursesRootPath(rootPath)

            return {
                success: true,
                path: rootPath,
                message: 'Dossier racine des cours défini avec succès'
            }
        } catch (error) {
            console.error('Error during course folder selection:', error)
            return {
                success: false,
                message: `Error during course folder selection: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(IPC.COURSE.SCAN_COURSES, async () => {
        try {
            const courses = await courseImporter.scanForCourses()
            return {
                success: true,
                courses,
                message: `${courses.length} cours trouvés`
            }
        } catch (error) {
            console.error('Erreur lors du scan des cours:', error)
            return {
                success: false,
                message: `Error during scan course folder: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(IPC.COURSE.GET_ALL, async (): GetAllCourseIPCHandlerReturn => {
        const courses = await database.course.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Courses retrieved successfully'
        }
    })

    ipcMain.handle(IPC.COURSE.IMPORT, async (): ImportCourseIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner un fichier de cours (.zip)',
                filters: [{ name: 'Archives ZIP', extensions: ['zip'] }],
                properties: ['openFile']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Aborted operation' }
            }
            const courseId = await courseImporter.importCourseArchive(filePaths[0])

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
        IPC.COURSE.REMOVE,
        async (
            _event,
            { courseId }: RemoveCourseIPCHandlerParams
        ): RemoveCourseIPCHandlerReturn => {
            try {
                await courseImporter.removeCourse(courseId)
                return { success: true, message: 'Course deleted successfully' }
            } catch (error) {
                console.error('Error durring import course:', error)
                return {
                    success: false,
                    message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
                }
            }
        }
    )
}
