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
            message: 'Root folder retrieved successfully'
        }
    })

    ipcMain.handle(IPC.FOLDER.SET_ROOT, async (): SetCoursesRootFolderIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Select Root Folder',
                properties: ['openDirectory']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Operation canceled' }
            }

            const rootPath = filePaths[0]
            await folderService.setRootPath(rootPath)

            return {
                success: true,
                data: { path: rootPath },
                message: 'Root folder set successfully'
            }
        } catch (error) {
            console.error('Error during course folder selection:', error)
            return {
                success: false,
                message: `Error selecting root folder: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(IPC.FOLDER.REMOVE_ROOT, async (): RemoveRootFolderIPCHandlerReturn => {
        try {
            await folderService.removeRootPath()
            return {
                success: true,
                message: 'Root folder removed successfully'
            }
        } catch (error) {
            console.error('Error during course folder deletion:', error)
            return {
                success: false,
                message: `Error removing root folder: ${error instanceof Error ? error.message : 'Unknown error'}`
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
                        ? `${scannedCourses.length} new courses or updates detected`
                        : 'No new courses or updates detected'
            }
        } catch (error) {
            console.error('Error during scan course folder: ', error)
            return {
                success: false,
                message: `Error during scan: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(IPC.FOLDER.IMPORT_ARCHIVE, async (): ImportCourseArchiveIPCHandlerReturn => {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog({
                title: 'Select Course File (.zip)',
                filters: [{ name: 'ZIP Archives', extensions: ['zip'] }],
                properties: ['openFile']
            })

            if (canceled || filePaths.length === 0) {
                return { success: false, message: 'Aborted operation' }
            }
            const course = await courseService.create(filePaths[0], 'archive')

            return {
                success: true,
                data: { course },
                message: 'Course imported successfully'
            }
        } catch (error) {
            console.error('Error during import course:', error)
            return {
                success: false,
                message: `Error during import: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })
}
