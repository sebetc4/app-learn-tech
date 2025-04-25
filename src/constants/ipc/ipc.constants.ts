import { IPC_COURSE, IPC_MEDIA, IPC_THEME } from './channels'
import { IPC_FOLDER } from './channels/folder-ipc.constants'

export const IPC = {
    FOLDER: IPC_FOLDER,
    COURSE: IPC_COURSE,
    MEDIA: IPC_MEDIA,
    THEME: IPC_THEME
} as const
