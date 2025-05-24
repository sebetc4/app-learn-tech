import { IPC_COURSE, IPC_FOLDER, IPC_LESSON, IPC_PROGRESS } from './channels'
import { IPC_USER } from './channels/user-ipc.constants'

export const IPC = {
    FOLDER: IPC_FOLDER,
    COURSE: IPC_COURSE,
    LESSON: IPC_LESSON,
    USER: IPC_USER,
    PROGRESS: IPC_PROGRESS
} as const
