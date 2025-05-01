import { LessonService } from '../services/lesson/lesson.service'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import { GetOneLessonIPCHandlerParams, GetOneLessonIPCHandlerReturn } from '@/types'

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
}
