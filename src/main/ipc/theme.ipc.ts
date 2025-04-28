import { ThemeService } from '../services'
import { IPC } from '@/constants'
import { ipcMain, nativeTheme } from 'electron'

import { SetThemeIPCHandlerParams } from '@/types'

export const registerThemeIpcHandlers = (themeService: ThemeService) => {
    ipcMain.handle(IPC.THEME.GET, async () => {
        return {
            success: true,
            data: { theme: themeService.currentTheme },
            message: 'Theme retrieved successfully'
        }
    })

    ipcMain.handle(IPC.THEME.SET, async (_event, { theme }: SetThemeIPCHandlerParams) => {
        try {
            await themeService.setCurrentTheme(theme)
            return {
                success: true,
                message: 'Theme set successfully'
            }
        } catch (error) {
            console.error(`Error setting theme: ${error}`)
            return {
                success: false,
                message: 'Failed to set theme'
            }
        }
    })

    ipcMain.handle(IPC.THEME.TOGGLE, async () => {
        try {
            const theme = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
            await themeService.setCurrentTheme(theme)
            return {
                success: true,
                message: 'Theme toggled successfully'
            }
        } catch (error) {
            console.error(`Error toggling theme: ${error}`)
            return {
                success: false,
                message: 'Failed to toggle theme'
            }
        }
    })
}
