import { nativeTheme } from 'electron'

export class ThemeService {
    readonly #THEME_VALUE: Record<Theme, 'light' | 'dark' | 'system'> = {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    }

    async setCurrentTheme(theme: Theme) {
        nativeTheme.themeSource = this.#THEME_VALUE[theme]
    }
}
