import { IPC_THEME, IPC_COURSE, IPC_MEDIA } from './channels'

export const IPC = {
    COURSE: IPC_COURSE,
    MEDIA: IPC_MEDIA,
    THEME: IPC_THEME,
} as const
