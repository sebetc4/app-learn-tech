import { IPC_COURSE, IPC_FOLDER, IPC_LESSON, IPC_THEME } from './channels'

export const IPC = {
    FOLDER: IPC_FOLDER,
    COURSE: IPC_COURSE,
    LESSON: IPC_LESSON,
    THEME: IPC_THEME
} as const
