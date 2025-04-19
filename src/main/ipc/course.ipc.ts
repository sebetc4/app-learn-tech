import { CourseImporterService } from '../services/course-importer/course-importer.service'
import { IPC } from '@/constants'
import { DatabaseService } from '@main/services/database'
import { dialog, ipcMain } from 'electron'

export const registerCourseIpcHandlers = (database: DatabaseService) => {
    const courseImporter = new CourseImporterService(database)

    ipcMain.handle(IPC.COURSE.GET_ALL, async () => {
        const courses = await database.course.getAll()
        return {
            success: true,
            data: { courses },
            message: 'Courses retrieved successfully'
        }
    })

    ipcMain.handle(IPC.COURSE.IMPORT, async (_event, _args) => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner un fichier de cours (.zip)',
                filters: [{ name: 'Archives ZIP', extensions: ['zip'] }],
                properties: ['openFile']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Aborted operation' }
            }

            const courseId = await courseImporter.importCourse(filePaths[0])
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

    ipcMain.handle(IPC.COURSE.REMOVE, async (_event, courseId) => {
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
    })
}
