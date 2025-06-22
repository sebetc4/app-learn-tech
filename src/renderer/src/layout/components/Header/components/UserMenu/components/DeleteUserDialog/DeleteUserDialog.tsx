import styles from '../../UserMenu.module.scss'
import { Button, Dialog } from '@/renderer/src/components'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useUserStore } from '@/renderer/src/store'
import { Trash2 } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface DeleteUserDialogProps {
    userId: string
}

export const DeleteUserDialog: FC<DeleteUserDialogProps> = ({ userId }) => {
    const deleteUser = useUserStore((state) => state.delete)

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const handleDeleteUser = async () => {
        const isCurrentUserModified = await deleteUser(userId)
        if (isCurrentUserModified) navigate(PAGE_PATH.HOME)
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
