import styles from '../../UserMenu.module.scss'
import { Button, Dialog } from '@/renderer/src/components'
import { createUserSchema } from '@/renderer/src/schemas/user.schema'
import { useUserStore } from '@/renderer/src/store'
import { CreateUserDto } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const AddUserDialog = () => {
    const users = useUserStore((state) => state.users)
    const addUser = useUserStore((state) => state.addUser)
    const [open, setOpen] = useState(false)

    const initialValues = {
        name: ''
    }

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CreateUserDto>({
        defaultValues: initialValues,
        resolver: yupResolver(createUserSchema),
        mode: 'onTouched'
    })

    const submit = async (data: CreateUserDto) => {
        try {
            const userExists = users.some((user) => user.name === data.name)
            if (userExists) {
                setError('name', {
                    type: 'manual',
                    message: 'User already exists'
                })
                return
            }
            await addUser(data)
            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Dialog
            open={open}
            setOpen={setOpen}
            title="Add User"
            description="Enter the name of the new user."
            trigger={
                <div
                    onClick={() => setOpen(true)}
                    className={clsx(styles['item'], styles['item--small'])}
                >
                    <Plus className={styles['plus-icon']} />
                    Add User
                </div>
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
                            <Button disabled={isSubmitting}>Add</Button>
                        </div>
                    </form>
                </div>
            }
        />
    )
}
