import styles from './Dialog.module.scss'
import { X } from 'lucide-react'
import { Dialog as RadixDialog } from 'radix-ui'
import { FC } from 'react'

interface Dialog {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string
    trigger: React.ReactNode
    content: React.ReactNode
    useCloseButton?: boolean
}

export const Dialog: FC<Dialog> = ({
    open,
    setOpen,
    title,
    description,
    trigger,
    content,
    useCloseButton = false
}) => (
    <RadixDialog.Root
        open={open}
        onOpenChange={setOpen}
    >
        <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
        <RadixDialog.Portal>
            <RadixDialog.Overlay className={styles.overlay} />
            <RadixDialog.Content className={styles.content}>
                <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
                <RadixDialog.Description className={styles.description}>
                    {description}
                </RadixDialog.Description>
                {content}
                {useCloseButton && (
                    <RadixDialog.Close asChild>
                        <button
                            className={styles['icon-button']}
                            aria-label="Close"
                        >
                            <X />
                        </button>
                    </RadixDialog.Close>
                )}
            </RadixDialog.Content>
        </RadixDialog.Portal>
    </RadixDialog.Root>
)
