import { useCallback, useEffect, useState } from 'react'

export const ThemeSelector = () => {
    const [theme, setTheme] = useState('system')

    const getTheme = useCallback(async () => {
        const response = window.api.theme.get()
        if (response.success) {
            setTheme(response.data.theme)
        } else {
            setTheme('system')
        }
    }, [])

    const applyTheme = (theme: string) => {
        switch (theme) {
            case 'light':
                window.api.theme.set('light')
                break
            case 'dark':
                window.api.theme.set('dark')
                break
            case 'system':
                window.api.theme.set('system')
                break
            default:
                window.api.theme.set('system')
                break
        }
    }

    useEffect(() => {
        getTheme()
    }, [])

    return (
        <div>
            <select
                value={theme}
                onChange={(e) => {
                    setTheme(e.target.value)
                    applyTheme(e.target.value)
                }}
            >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="system">Système</option>
            </select>
        </div>
    )
}
