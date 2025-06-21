import styles from '../../UserMenu.module.scss'
import { DeleteUserDialog } from '../DeleteUserDialog/DeleteUserDialog'
import { UpdateUserDialog } from '../UpdateUserDialog/UpdateUserDialog'
import { useUserStore } from '@/renderer/src/store/user.store'
import { Check, Dot } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

export const UserList = () => {
    const setCurrentUser = useUserStore((state) => state.setCurrentUser)
    const currentUserId = useUserStore((state) => state.current.id)
    const users = useUserStore((state) => state.users)

    return users.map((user) => (
        <div
            key={user.id}
            className={styles['user-item']}
        >
            <DropdownMenu.Item
                onClick={() => setCurrentUser(user.id)}
                className={styles['user-item__selector']}
            >
                {currentUserId === user.id ? (
                    <Check className={styles['check-icon']} />
                ) : (
                    <Dot className={styles['dot-icon']} />
                )}
                <p>{user.name}</p>
            </DropdownMenu.Item>
            <div className={styles['user-item__actions']}>
                <UpdateUserDialog userId={user.id} />
                {users.length > 1 && <DeleteUserDialog userId={user.id} />}
            </div>
        </div>
    ))
}
