import styles from './UserMenu.module.scss'
import { ThemeSelector, UserSelector } from './components'
import { User } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

export const UserMenu = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className={styles.trigger}
                    aria-label="Customise options"
                >
                    <User />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={styles.content}
                    sideOffset={5}
                >
                    <UserSelector />
                    <ThemeSelector />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
