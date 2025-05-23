import { ProgressLessonViewModel } from '../view-model'
import { IPCHandlerReturnWithData } from './core-ipc.types'

// Get Lessons Progress
export interface GetLessonsProgressIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        lessons: ProgressLessonViewModel[]
    }> {}
