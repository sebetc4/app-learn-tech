import styles from '../../UserMenu.module.scss'
import { AddUserDialog } from '../AddUserDialog/AddUserDialog'
import { UserList } from '../UserList/UserList'
import { ChevronRight } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

export const UserSelector = () => {
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
                    <UserList />
                    <DropdownMenu.Separator className={styles.separator} />
                    <AddUserDialog />
                </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
        </DropdownMenu.Sub>
    )
}
