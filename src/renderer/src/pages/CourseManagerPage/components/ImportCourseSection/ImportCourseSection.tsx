import styles from './ImportCourseSection.module.scss'
import { ImportCourseCard } from './components'
import { Button } from '@renderer/components'
import { useCourseFolderStore } from '@renderer/store'
import { FileArchive, RefreshCw } from 'lucide-react'
import { type FC } from 'react'

export const ImportCourseSection: FC = () => {
    const scannedCourses = useCourseFolderStore((state) => state.scannedCourses)
    const scanRootFolder = useCourseFolderStore((state) => state.scan)
    const importArchive = useCourseFolderStore((state) => state.importArchive)
    const rootFolderScanLoading = useCourseFolderStore((state) => state.rootFolderScanLoading)
    const isLoading = useCourseFolderStore((state) => state.isLoading)

    return (
        <section className={styles['import']}>
            <div className={styles['import__header']}>
                <h2>New courses / updates available ({scannedCourses.length})</h2>
                <Button
                    onClick={scanRootFolder}
                    disabled={isLoading}
                    variant="text"
                >
                    <RefreshCw />
                    Refresh
                </Button>
                <Button
                    onClick={importArchive}
                    disabled={isLoading}
                    variant="text"
                >
                    <FileArchive />
                    Import archive
                </Button>
                {/* <Button
                    // onClick={handleImportAllCourses}
                    disabled={isLoading || scannedCourses.length === 0}
                    variant="text"
                >
                    <CircleArrowDown />
                    Import all
                </Button> */}
            </div>

            <div className={styles['import__content']}>
                {rootFolderScanLoading ? (
                    <p>Loading...</p>
                ) : scannedCourses.length === 0 ? (
                    <p>No new courses or updates available.</p>
                ) : (
                    <ul>
                        {scannedCourses.map(({ metadata, directory }) => (
                            <ImportCourseCard
                                key={metadata.id}
                                metadata={metadata}
                                directory={directory}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
