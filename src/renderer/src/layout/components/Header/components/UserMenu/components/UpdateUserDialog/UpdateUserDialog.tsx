import styles from '../../UserMenu.module.scss'
import { Button, Dialog } from '@/renderer/src/components'
import { updateUserSchema } from '@/renderer/src/schemas/user.schema'
import { useUserStore } from '@/renderer/src/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserPen } from 'lucide-react'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { UpdateUserDto } from '@/types'

interface UpdateUserDialogProps {
    userId: string
}

export const UpdateUserDialog: FC<UpdateUserDialogProps> = ({ userId }) => {
    const users = useUserStore((state) => state.users)
    const updateUser = useUserStore((state) => state.update)
    const [open, setOpen] = useState(false)

    const initialValues = {
        name: users.find((user) => user.id === userId)?.name || ''
    }

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<UpdateUserDto>({
        defaultValues: initialValues,
        resolver: yupResolver(updateUserSchema),
        mode: 'onTouched'
    })

    const submit = async (data: UpdateUserDto) => {
        try {
            const userExists = users.some((user) => user.name === data.name)
            if (userExists) {
                setError('name', {
                    type: 'manual',
                    message: 'User already exists'
                })
                return
            }
            await updateUser(userId, data)
            setOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog
            open={open}
            setOpen={setOpen}
            title="Update User"
            description="Enter the name of the user."
            trigger={
                <button>
                    <UserPen className={styles['user-edit-icon']} />
                </button>
            }
            content={
                <div>
                    <form
                        onSubmit={handleSubmit(submit)}
                        className={`${styles.form}`}
                    >
                        <fieldset className={styles.form__field}>
                            <label htmlFor="name">Name</label>
                            <input {...register('name')} />
                            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                        </fieldset>
                        <div className={styles['form__submit']}>
                            <Button disabled={isSubmitting}>Update</Button>
                        </div>
                    </form>
                </div>
            }
        />
    )
}
