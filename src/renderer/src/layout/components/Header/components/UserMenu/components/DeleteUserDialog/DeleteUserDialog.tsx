import styles from '../../UserMenu.module.scss'
import { Button, Dialog } from '@/renderer/src/components'
import { useUserStore } from '@/renderer/src/store'
import { Trash2 } from 'lucide-react'
import { FC, useState } from 'react'

interface DeleteUserDialogProps {
    userId: string
}

export const DeleteUserDialog: FC<DeleteUserDialogProps> = ({ userId }) => {
    const [open, setOpen] = useState(false)

    const deleteUser = useUserStore((state) => state.delete)

    const handleDeleteUser = () => {
        deleteUser(userId)
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            setOpen={setOpen}
            title="Remove User"
            description="Are you sure you want to remove this user? This action cannot be undone."
            trigger={
                <button onClick={() => setOpen(true)}>
                    <Trash2 className={styles['delete-icon']} />
                </button>
            }
            content={
                <div className={styles['dialog__actions']}>
                    <Button onClick={() => handleDeleteUser()}>Remove</Button>
                </div>
            }
        />
    )
}
