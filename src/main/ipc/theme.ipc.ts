import { IPC } from '@/constants'
import { DatabaseService } from '@main/services/database'
import { SettingKey } from '@prisma/client'
import { ipcMain, nativeTheme } from 'electron'

import { SetThemeIPCHandlerParams, ThemeValue } from '@/types'

export const registerThemeIpcHandlers = async (database: DatabaseService) => {
    nativeTheme.themeSource = (await database.setting.get<ThemeValue>(SettingKey.THEME)) || 'system'

    ipcMain.handle(IPC.THEME.GET, async () => {
        try {
            const theme = await database.setting.get<ThemeValue>(SettingKey.THEME)
            if (!theme) throw new Error('Theme not found in database')
            return {
                success: true,
                data: { theme },
                message: 'Theme retrieved successfully'
            }
        } catch {
            return {
                success: false,
                message: 'Failed to retrieve theme'
            }
        }
    })

    ipcMain.handle(IPC.THEME.SET, async (_event, { theme }: SetThemeIPCHandlerParams) => {
        try {
            if (theme !== 'dark' && theme !== 'light' && theme !== 'system') {
                throw new Error('Invalid theme value')
            }
            await database.setting.update({
                key: SettingKey.THEME,
                value: theme
            })
            nativeTheme.themeSource = theme
            return {
                success: true,
                message: 'Theme set successfully'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to set theme'
            }
        }
    })

    ipcMain.handle(IPC.THEME.TOGGLE, () => {
        try {
            const theme = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
            nativeTheme.themeSource = theme
            database.setting.update({
                key: SettingKey.THEME,
                value: theme
            })
            return {
                success: true,
                message: 'Theme toggled successfully'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to toggle theme'
            }
        }
    })
}
