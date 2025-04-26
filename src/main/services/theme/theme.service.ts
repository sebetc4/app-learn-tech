import { DatabaseService } from '../database'
import { nativeTheme } from 'electron'

import { ThemeValue } from '@/types'

export class ThemeService {
    #database: DatabaseService

    #theme!: ThemeValue

    constructor(database: DatabaseService) {
        this.#database = database
    }

    get currentTheme(): ThemeValue {
        return this.#theme
    }

    async initialize() {
        const theme = (await this.#database.setting.get<ThemeValue>('THEME')) || 'system'
        this.#theme = theme
        nativeTheme.themeSource = theme
    }

    async setCurrentTheme(value: ThemeValue) {
        await this.#database.setting.update({ key: 'THEME', value })
        this.#theme = value
        nativeTheme.themeSource = value
    }
}
