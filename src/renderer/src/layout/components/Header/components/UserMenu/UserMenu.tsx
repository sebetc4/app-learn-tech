import styles from './UserMenu.module.scss'
import { ThemeSelector } from './components'
import { User } from 'lucide-react'
import { Menubar } from 'radix-ui'

export const UserMenu = () => {
    return (
        <Menubar.Root className={styles.root}>
            <Menubar.Menu>
                <Menubar.Trigger className={styles.trigger}>
                    <User />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content
                        className={styles.content}
                        align="start"
                        sideOffset={5}
                        alignOffset={-3}
                    >
                        <Menubar.Item className={styles.item}>
                            New Tab <div className="RightSlot">⌘ T</div>
                        </Menubar.Item>
                        <Menubar.Item className={styles.item}>
                            New Window <div className="RightSlot">⌘ N</div>
                        </Menubar.Item>
                        <Menubar.Item
                            className={styles.item}
                            disabled
                        >
                            New Incognito Window
                        </Menubar.Item>
                        <Menubar.Separator className={styles.separator} />
                        <ThemeSelector />
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
    )
}
