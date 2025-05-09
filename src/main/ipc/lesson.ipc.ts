import { FolderService } from '../services'
import { LessonService } from '../services/lesson/lesson.service'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'
import fs from 'fs/promises'

import type {
    GetJSXLessonContentIPCHandlerParams,
    GetNavigationElementIPCHandlerParams,
    GetNavigationElementIPCHandlerReturn,
    GetOneLessonIPCHandlerParams,
    GetOneLessonIPCHandlerReturn
} from '@/types'

export const registerLessonIpcHandlers = (
    lessonService: LessonService,
    folderService: FolderService
) => {
    ipcMain.handle(
        IPC.LESSON.GET_ONE,
        async (
            _event,
            { lessonId }: GetOneLessonIPCHandlerParams
        ): GetOneLessonIPCHandlerReturn => {
            try {
                const lesson = await lessonService.getOne(lessonId)
                return {
                    success: true,
                    data: { lesson },
                    message: 'Leçon récupérée avec succès'
                }
            } catch (error) {
                console.error('Error during import course:', error)
                return {
                    success: false,
                    message: `Erreur lors de la récupération de la leçon`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.LESSON.GET_NAVIGATION_ELEMENT,
        async (
            _event,
            { courseId, chapterId }: GetNavigationElementIPCHandlerParams
        ): GetNavigationElementIPCHandlerReturn => {
            try {
                const navigationElement = await lessonService.getNavigationElement({
                    courseId,
                    chapterId
                })
                return {
                    success: true,
                    data: { navigationElement },
                    message: 'Élément de navigation récupéré avec succès'
                }
            } catch (error) {
                console.error('Error during import course:', error)
                return {
                    success: false,
                    message: `Erreur lors de la récupération de l'élément de navigation`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.LESSON.GET_JSX_CONTENT,
        async (_event, { jsxPath }: GetJSXLessonContentIPCHandlerParams) => {
            try {
                const fullJsxPath = folderService.getFullPath(jsxPath)

                try {
                    await fs.access(fullJsxPath)
                } catch {
                    throw new Error(`Fichier JSX non trouvé: ${jsxPath}`)
                }

                const jsxContent = await fs.readFile(fullJsxPath, 'utf-8')
                const dependencies = {}
                return {
                    success: true,
                    data: {
                        jsxContent,
                        dependencies
                    },
                    message: 'Élément de navigation récupéré avec succès'
                }
            } catch (error) {
                console.error('Erreur lors du chargement du contenu JSX:', error)
                return {
                    success: false,
                    message: `Erreur lors du chargement du contenu JSX`
                }
            }
        }
    )
}
