import styles from './RootFolderSection.module.scss'
import { Button } from '@/renderer/src/components'
import { useCourseFolderStore } from '@/renderer/src/store'
import { FC, useEffect, useState } from 'react'

export const RootFolderSection: FC = () => {
    const [selectFolderLoading, setSelectFolderLoading] = useState(false)
    const [availableSpace, setAvailableSpace] = useState<number | null>(null)
    const handleSelectRootFolder = useCourseFolderStore((state) => state.handleSelectRootFolder)
    const rootFolder = useCourseFolderStore((state) => state.rootFolder)
    const isLoading = useCourseFolderStore((state) => state.isLoading)

    const handleClick = async () => {
        setSelectFolderLoading(true)
        await handleSelectRootFolder()
        setSelectFolderLoading(false)
    }

    const directoryButtonText = () => {
        if (selectFolderLoading) return 'Loading...'
        if (rootFolder) return 'Change folder'
        return 'Select a folder'
    }

    const directoryText = () => {
        if (selectFolderLoading) return 'Loading...'
        if (rootFolder) return rootFolder
        return 'No folder selected'
    }

    const formatBytes = (bytes: number): string => {
        const gb = bytes / 1024 ** 3
        const tb = bytes / 1024 ** 4

        if (tb >= 1) {
            return `${tb.toFixed(2)} TB`
        }
        return `${gb.toFixed(2)} GB`
    }

    useEffect(() => {
        const fetchDiskSpace = async () => {
            if (!rootFolder) {
                setAvailableSpace(null)
                return
            }

            try {
                const response = await window.api.folder.getDiskSpace()
                if (response.success && response.data) {
                    setAvailableSpace(response.data.availableSpace)
                }
            } catch (error) {
                console.error('Error fetching disk space:', error)
                setAvailableSpace(null)
            }
        }

        fetchDiskSpace()
    }, [rootFolder])

    return (
        <section className={styles['folder']}>
            <div className={styles['folder__header']}>
                <h2>Courses Root Folder</h2>
                {availableSpace !== null && (
                    <span className={styles['folder__space']}>
                        {formatBytes(availableSpace)} available
                    </span>
                )}
            </div>
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
