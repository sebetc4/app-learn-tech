import { LessonService } from '../services/lesson/lesson.service'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import type {
    GetNavigationElementIPCHandlerParams,
    GetNavigationElementIPCHandlerReturn,
    GetOneLessonIPCHandlerParams,
    GetOneLessonIPCHandlerReturn
} from '@/types'

export const registerLessonIpcHandlers = (lessonService: LessonService) => {
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
}
