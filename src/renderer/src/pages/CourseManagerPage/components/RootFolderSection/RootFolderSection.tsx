import styles from './RootFolderSection.module.scss'
import { Button } from '@/renderer/src/components'
import { useCourseFolderStore } from '@/renderer/src/store'
import { FC, useState } from 'react'

export const RootFolderSection: FC = () => {
    const [selectFolderLoading, setSelectFolderLoading] = useState(false)
    const handleSelectRootFolder = useCourseFolderStore((state) => state.handleSelectRootFolder)
    const rootFolder = useCourseFolderStore((state) => state.rootFolder)
    const isLoading = useCourseFolderStore((state) => state.isLoading)

    const handleClick = async () => {
        setSelectFolderLoading(true)
        await handleSelectRootFolder()
        setSelectFolderLoading(false)
    }

    const directoryButtonText = () => {
        if (selectFolderLoading) return 'Chargement...'
        if (rootFolder) return 'Modifier le dossier'
        return 'Sélectionner un dossier'
    }

    const directoryText = () => {
        if (selectFolderLoading) return 'Chargement...'
        if (rootFolder) return rootFolder
        return 'Aucun dossier sélectionné'
    }

    return (
        <section className={styles['folder']}>
            <h2>Dossier racine des cours</h2>
            <div className={styles['folder__content']}>
                <p>{directoryText()}</p>
                <Button
                    onClick={handleClick}
                    disabled={isLoading}
                >
                    {directoryButtonText()}
                </Button>
            </div>
        </section>
    )
}
