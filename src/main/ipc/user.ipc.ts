import { UserService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

export const registerUserIpcHandlers = (userService: UserService) => {
    ipcMain.handle(IPC.USER.GET_CURRENT_USER, async () => {
        try {
            const user = await userService.getCurrent()
            return {
                success: true,
                data: { user },
                message: 'User retrieved successfully'
            }
        } catch (error) {
            console.error(
                `Error retrieving current user: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to retrieve user data'
            }
        }
    })

    ipcMain.handle(IPC.USER.GET_ONE, async (_event, userId) => {
        try {
            const user = await userService.getOne(userId)
            return {
                success: true,
                data: user,
                message: 'User retrieved successfully'
            }
        } catch (error) {
            console.error(
                `Error retrieving user with ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to retrieve user data'
            }
        }
    })

    ipcMain.handle(IPC.USER.GET_ALL, async () => {
        try {
            const users = await userService.getAll()
            return {
                success: true,
                data: users,
                message: 'Users retrieved successfully'
            }
        } catch (error) {
            console.error(
                `Error retrieving all users: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to retrieve user data'
            }
        }
    })

    ipcMain.handle(IPC.USER.UPDATE_THEME, async (_event, { userId, theme }) => {
        try {
            await userService.updateTheme(userId, theme)
            return {
                success: true,
                message: 'User theme updated successfully'
            }
        } catch (error) {
            console.error(
                `Error updating theme for user with ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to update user theme'
            }
        }
    })
}
