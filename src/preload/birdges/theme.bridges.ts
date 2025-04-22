import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import { SetThemeIPCHandlerParams } from '@/types'

export const themeContextBridge = {
    get: () => ipcRenderer.invoke(IPC.THEME.GET),
    set: (params: SetThemeIPCHandlerParams) => ipcRenderer.invoke(IPC.THEME.SET, params),
    toggle: () => ipcRenderer.invoke(IPC.THEME.TOGGLE)
}
