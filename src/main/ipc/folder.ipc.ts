import { IPC } from '@/constants'
import type { CourseService, FolderService } from '@main/services'
import { dialog, ipcMain } from 'electron'

import type {
    GetCoursesRootFolderIPCHandlerReturn,
    ImportCourseArchiveIPCHandlerReturn,
    RemoveRootFolderIPCHandlerReturn,
    ScanRootFolderIPCHandlerReturn,
    SetCoursesRootFolderIPCHandlerReturn
} from '@/types'

export const registerFolderIpcHandlers = (
    courseService: CourseService,
    folderService: FolderService
) => {
    /**
     * --------------------------------
     * Root
     * --------------------------------
     */
    ipcMain.handle(IPC.FOLDER.GET_ROOT, async (): GetCoursesRootFolderIPCHandlerReturn => {
        return {
            success: true,
            data: { path: folderService.rootPath },
            message: 'Dossier racine des cours défini avec succès'
        }
    })

    ipcMain.handle(IPC.FOLDER.SET_ROOT, async (): SetCoursesRootFolderIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner le dossier racine des cours',
                properties: ['openDirectory']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Opération annulée' }
            }

            const rootPath = filePaths[0]
            await folderService.setRootPath(rootPath)

            return {
                success: true,
                data: { path: rootPath },
                message: 'Dossier racine des cours défini avec succès'
            }
        } catch (error) {
            console.error('Error during course folder selection:', error)
            return {
                success: false,
                message: `Erreur lors de la sélection du dossier racine des cours`
            }
        }
    })

    ipcMain.handle(IPC.FOLDER.REMOVE_ROOT, async (): RemoveRootFolderIPCHandlerReturn => {
        try {
            await folderService.removeRootPath()
            return {
                success: true,
                message: 'Dossier racine des cours supprimé avec succès'
            }
        } catch (error) {
            console.error('Error during course folder deletion:', error)
            return {
                success: false,
                message: `Erreur lors de la suppression du dossier racine des cours`
            }
        }
    })

    /**
     * --------------------------------
     * Scan
     * --------------------------------
     */
    ipcMain.handle(IPC.FOLDER.SCAN, async (): ScanRootFolderIPCHandlerReturn => {
        try {
            const courses = await folderService.scanForCourses()
            const scannedCourses = await courseService.sortScannedCourses(courses)
            return {
                success: true,
                data: { scannedCourses },
                message:
                    scannedCourses.length > 0
                        ? `${scannedCourses.length} nouveaux cours ou mises à jour détectés`
                        : 'Pas de nouveau cours ou mise à jour détecté'
            }
        } catch (error) {
            console.error('Error during scan course folder: ', error)
            return {
                success: false,
                message: "Erreur lors de l'analyse des cours"
            }
        }
    })

    ipcMain.handle(IPC.FOLDER.IMPORT_ARCHIVE, async (): ImportCourseArchiveIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Sélectionner un fichier de cours (.zip)',
                filters: [{ name: 'Archives ZIP', extensions: ['zip'] }],
                properties: ['openFile']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Aborted operation' }
            }
            const course = await courseService.importCourseArchive(filePaths[0])

            return {
                success: true,
                data: { course },
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
}
