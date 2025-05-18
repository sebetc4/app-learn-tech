import { FolderService } from '../services'
import { LessonService } from '../services/lesson/lesson.service'
import { pathService } from '../services/pats/pathService'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'
import fs from 'fs/promises'

import type {
    GetCodeSnippetContentIPCHandlerParams,
    GetJSXLessonContentIPCHandlerParams,
    GetLessonDataIPCHandlerParams,
    GetLessonDataIPCHandlerReturn
} from '@/types'

export const registerLessonIpcHandlers = (
    lessonService: LessonService,
    folderService: FolderService
) => {
    ipcMain.handle(
        IPC.LESSON.GET_DATA,
        async (_event, params: GetLessonDataIPCHandlerParams): GetLessonDataIPCHandlerReturn => {
            try {
                const dataLesson = await lessonService.getData(params)
                return {
                    success: true,
                    data: dataLesson,
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
        IPC.LESSON.GET_JSX_CONTENT,
        async (_event, params: GetJSXLessonContentIPCHandlerParams) => {
            try {
                const jsxPath = pathService.getJsxPath(params)
                console.log('jsxPath', jsxPath)
                const fullJsxPath = folderService.getPathFromFolder(jsxPath)

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

    ipcMain.handle(
        IPC.LESSON.GET_CODE_SNIPPET_CONTENT,
        async (_event, params: GetCodeSnippetContentIPCHandlerParams) => {
            try {
                const codeSnippetPath = pathService.getCodeSnippetPath(params)
                const fullPath = folderService.getPathFromFolder(codeSnippetPath)
                console.log('fullPath', fullPath)

                try {
                    await fs.access(fullPath)
                } catch {
                    throw new Error(`Fichier de code non trouvé: ${codeSnippetPath}`)
                }

                const content = await fs.readFile(fullPath, 'utf-8')
                return {
                    success: true,
                    data: { content },
                    message: 'Contenu du code récupéré avec succès'
                }
            } catch (error) {
                console.error('Erreur lors du chargement du contenu du code:', error)
                return {
                    success: false,
                    message: `Erreur lors du chargement du contenu du code`
                }
            }
        }
    )
}
