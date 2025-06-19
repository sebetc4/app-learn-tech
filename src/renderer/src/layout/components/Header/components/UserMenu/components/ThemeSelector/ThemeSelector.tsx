import styles from '../../UserMenu.module.scss'
import { useUserStore } from '@/renderer/src/store/user.store'
import { Check, ChevronRight, Dot } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

import { Theme } from '@/types'

const themes: Array<{ name: string; value: Theme }> = [
    {
        name: 'Light',
        value: 'LIGHT'
    },
    {
        name: 'Dark',
        value: 'DARK'
    },
    {
        name: 'System',
        value: 'SYSTEM'
    }
]

export const ThemeSelector = () => {
    const currentTheme = useUserStore((state) => state.current.theme)
    const updateTheme = useUserStore((state) => state.updateTheme)

    const applyTheme = (theme: Theme) => {
        updateTheme(theme)
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles['sub-trigger']}>
                Theme
                <div className={styles['right-slot']}>
                    <ChevronRight />
                </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                    className={styles['sub-content']}
                    sideOffset={2}
                    alignOffset={-5}
                >
                    {themes.map((theme) => (
                        <DropdownMenu.Item
                            key={theme.value}
                            className={styles.item}
                            onClick={() => applyTheme(theme.value)}
                        >
                            {currentTheme === theme.value ? (
                                <Check className={styles.check} />
                            ) : (
                                <Dot className={styles.dot} />
                            )}
                            {theme.name}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
        </DropdownMenu.Sub>
    )
}
