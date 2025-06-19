import { DatabaseService } from '../database'
import { ThemeService } from '../theme/theme.service'
import { Theme } from '@/types'

import type { UserViewModel, UserViewModelWithoutTheme } from '@/types'

export class UserService {
    #database: DatabaseService
    #themeService: ThemeService
    constructor(database: DatabaseService, themeService: ThemeService) {
        this.#database = database
        this.#themeService = themeService
    }

    async getCurrent(): Promise<UserViewModel> {
        try {
            const currentUserId = await this.#database.setting.get('CURRENT_USER')
            if (!currentUserId) {
                throw new Error('Current user ID not found in settings')
            }
            const user = await this.getOne(currentUserId)
            this.#themeService.setCurrentTheme(user.theme)
            return user
        } catch {
            console.error('Error retrieving current user')
            throw new Error('Failed to retrieve current user')
        }
    }

    async getOne(userId: string): Promise<UserViewModel> {
        try {
            const user = await this.#database.user.getById(userId)
            if (!user) {
                throw new Error(`User with ID ${userId} not found`)
            }
            return user
        } catch (error) {
            console.error(`Error retrieving user with ID ${userId}: ${error}`)
            throw error
        }
    }

    async getAll(): Promise<UserViewModelWithoutTheme[]> {
        try {
            const users = await this.#database.user.getAll()
            if (!users) {
                throw new Error('No users found')
            }
            return users
        } catch (error) {
            console.error(`Error retrieving all users: ${error}`)
            throw error
        }
    }

    async updateTheme(userId: string, theme: Theme) {
        await this.#database.user.updateTheme(userId, theme)
        this.#themeService.setCurrentTheme(theme)
    }
}
