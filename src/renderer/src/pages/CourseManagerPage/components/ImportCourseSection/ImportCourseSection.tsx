import styles from './ImportCourseSection.module.scss'
import { ImportCourseCard } from './components'
import { Button } from '@renderer/components'
import { useCourseFolderStore } from '@renderer/store'
import { CircleArrowDown, RefreshCw } from 'lucide-react'
import { type FC } from 'react'

export const ImportCourseSection: FC = () => {
    const scannedCourses = useCourseFolderStore((state) => state.scannedCourses)
    const scanRootFolder = useCourseFolderStore((state) => state.scan)
    const rootFolderScanLoading = useCourseFolderStore((state) => state.rootFolderScanLoading)
    const isLoading = useCourseFolderStore((state) => state.isLoading)

    return (
        <section className={styles['import']}>
            <div className={styles['import__header']}>
                <h2>Nouveaux cours / mises à jour disponibles ({scannedCourses.length})</h2>
                <Button
                    onClick={scanRootFolder}
                    disabled={isLoading}
                    variant="text"
                >
                    <RefreshCw />
                    Rafraîchir
                </Button>
                <Button
                    // onClick={handleImportAllCourses}
                    disabled={isLoading || scannedCourses.length === 0}
                    variant="text"
                >
                    <CircleArrowDown />
                    Tout importer
                </Button>
            </div>

            <div className={styles['import__content']}>
                {rootFolderScanLoading ? (
                    <p>Chargement...</p>
                ) : scannedCourses.length === 0 ? (
                    <p>Pas de nouveaux cours ni de mises à jour disponibles.</p>
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
