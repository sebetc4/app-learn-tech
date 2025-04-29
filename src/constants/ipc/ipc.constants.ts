import { IPC_COURSE, IPC_FOLDER, IPC_MEDIA, IPC_THEME } from './channels'

export const IPC = {
    FOLDER: IPC_FOLDER,
    COURSE: IPC_COURSE,
    MEDIA: IPC_MEDIA,
    THEME: IPC_THEME
} as const
