import { IPC } from '@/constants'
import { ThemeValue } from '@/types'
import { ipcRenderer } from 'electron'

export const themeContextBridge = {
    get: () => ipcRenderer.invoke(IPC.THEME.GET),
    set: (value: ThemeValue) => ipcRenderer.invoke(IPC.THEME.SET, value),
    toggle: () => ipcRenderer.invoke(IPC.THEME.TOGGLE),
}
