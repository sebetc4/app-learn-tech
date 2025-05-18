import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import type { SetThemeIPCHandlerParams, ThemeAPI } from '@/types'

export const themeContextBridge: ThemeAPI = {
    get: () => ipcRenderer.invoke(IPC.THEME.GET),
    set: (params: SetThemeIPCHandlerParams) => ipcRenderer.invoke(IPC.THEME.SET, params),
    toggle: () => ipcRenderer.invoke(IPC.THEME.TOGGLE)
}
