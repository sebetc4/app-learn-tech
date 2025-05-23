import styles from '../../UserMenu.module.scss'
import { useUserStore } from '@/renderer/src/store/user.store'
import { Check, ChevronRight, Dot } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

export const UserSelector = () => {
    const currentUserId = useUserStore((state) => state.current.id)
    const users = useUserStore((state) => state.users)

    const changeUser = () => {
        console.log('Change user')
    }

    return (
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className={styles['sub-trigger']}>
                User
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
                    {users.map((user) => (
                        <DropdownMenu.Item
                            key={user.id}
                            className={styles.item}
                            onClick={() => changeUser()}
                        >
                            {currentUserId === user.id ? (
                                <Check className={styles.check} />
                            ) : (
                                <Dot className={styles.dot} />
                            )}
                            {user.name}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
        </DropdownMenu.Sub>
    )
}
