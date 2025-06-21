import { UserService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

export const registerUserIpcHandlers = (userService: UserService) => {
    ipcMain.handle(IPC.USER.CREATE, async (_event, userData) => {
        try {
            const user = await userService.create(userData)
            return {
                success: true,
                data: { user },
                message: 'User created successfully'
            }
        } catch (error) {
            console.error(
                `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to create user'
            }
        }
    })

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
                data: { user },
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
                data: { users },
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

    ipcMain.handle(IPC.USER.SET_CURRENT_USER, async (_event, { userId }) => {
        try {
            const user = await userService.getOne(userId)
            await userService.setCurrentUser(userId)
            return {
                success: true,
                data: { user },
                message: 'Current user set successfully'
            }
        } catch (error) {
            console.error(
                `Error setting current user with ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to set current user'
            }
        }
    })

    ipcMain.handle(IPC.USER.UPDATE, async (_event, { userId, userData }) => {
        try {
            const updatedUser = await userService.update(userId, userData)
            return {
                success: true,
                data: { user: updatedUser },
                message: 'User updated successfully'
            }
        } catch (error) {
            console.error(
                `Error updating user with ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to update user'
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

    ipcMain.handle(IPC.USER.DELETE, async (_event, userId) => {
        try {
            await userService.delete(userId)
            return {
                success: true,
                message: 'User removed successfully'
            }
        } catch (error) {
            console.error(
                `Error removing user with ID ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
            return {
                success: false,
                message: 'Failed to remove user'
            }
        }
    })
}
