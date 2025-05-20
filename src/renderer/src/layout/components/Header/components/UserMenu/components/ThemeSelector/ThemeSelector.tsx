import styles from '../../UserMenu.module.scss'
import { useUserStore } from '@/renderer/src/store/user.store'
import { Theme } from '@prisma/client'
import { Check, ChevronRight, Dot } from 'lucide-react'
import { Menubar } from 'radix-ui'

const themes = [
    {
        name: 'Light',
        value: Theme.LIGHT
    },
    {
        name: 'Dark',
        value: Theme.DARK
    },
    {
        name: 'System',
        value: Theme.SYSTEM
    }
]

export const ThemeSelector = () => {
    const currentTheme = useUserStore((state) => state.theme)
    const updateTheme = useUserStore((state) => state.updateTheme)

    const applyTheme = (theme: Theme) => {
        updateTheme(theme)
    }

    return (
        <Menubar.Sub>
            <Menubar.SubTrigger className={styles['sub-trigger']}>
                Thème
                <div className={styles['chevron-right']}>
                    <ChevronRight />
                </div>
            </Menubar.SubTrigger>
            <Menubar.Portal>
                <Menubar.SubContent
                    className={styles['sub-content']}
                    alignOffset={-5}
                >
                    {themes.map((theme) => (
                        <Menubar.Item
                            key={theme.value}
                            className={styles.item}
                            onClick={() => applyTheme(theme.value)}
                        >
                            {currentTheme === theme.value ? <Check /> : <Dot />}
                            {theme.name}
                        </Menubar.Item>
                    ))}
                </Menubar.SubContent>
            </Menubar.Portal>
        </Menubar.Sub>
    )
}
