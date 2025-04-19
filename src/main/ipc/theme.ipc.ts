import { IPC } from '@/constants'
import { DatabaseService } from '@main/services/database'
import { ipcMain, nativeTheme } from 'electron'

import { ThemeValue } from '@/types'

export const registerThemeIpcHandlers = (_database: DatabaseService) => {
    ipcMain.handle(IPC.THEME.GET, () => {
        return {
            success: true,
            data: {
                theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
            },
            message: 'Theme retrieved successfully'
        }
    })
    ipcMain.handle(IPC.THEME.SET, (_event, value: ThemeValue) => {
        if (value !== 'dark' && value !== 'light' && value !== 'system') {
            return {
                success: false,
                message: 'Invalid theme value'
            }
        }
        nativeTheme.themeSource = value
        return {
            success: true,
            message: 'Theme set successfully'
        }
    })
    ipcMain.handle(IPC.THEME.TOGGLE, () => {
        nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
        return {
            success: true,
            message: 'Theme toggled successfully'
        }
    })
}
