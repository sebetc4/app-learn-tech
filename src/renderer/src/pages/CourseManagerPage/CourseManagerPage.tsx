import { Button } from '../../components'
import { useCourseFolderStore, useCoursesStore } from '../../store'
import styles from './CourseManagerPage.module.scss'
import { ImportCourseCard, ImportedCourseCard } from './components'
import { CircleArrowDown, RefreshCw } from 'lucide-react'
import { FC, useEffect } from 'react'

export const CourseImporterPage: FC = () => {
    const rootFolder = useCourseFolderStore((state) => state.rootFolder)
    const scannedCourses = useCourseFolderStore((state) => state.scannedCourses)
    const selectFolderIsLoading = useCourseFolderStore((state) => state.selectFolderIsLoading)
    const scanCoursesIsLoading = useCourseFolderStore((state) => state.scanCoursesIsLoading)
    const handleSelectRootFolder = useCourseFolderStore((state) => state.handleSelectRootFolder)
    const scanRootFolder = useCourseFolderStore((state) => state.scan)

    const importedCourses = useCoursesStore((state) => state.courses)

    const directoryButtonText = () => {
        if (selectFolderIsLoading) return 'Chargement...'
        if (rootFolder) return 'Modifier le dossier'
        return 'Sélectionner un dossier'
    }

    const directoryText = () => {
        if (selectFolderIsLoading) return 'Chargement...'
        if (rootFolder) return rootFolder
        return 'Aucun dossier sélectionné'
    }

    useEffect(() => {
        scanRootFolder()
    }, [scanRootFolder])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestionnaire de cours</h1>

            <section className={styles['folder']}>
                <h2>Dossier racine des cours</h2>
                <div className={styles['folder__content']}>
                    <p>{directoryText()}</p>
                    <Button
                        onClick={handleSelectRootFolder}
                        disabled={selectFolderIsLoading}
                    >
                        {directoryButtonText()}
                    </Button>
                </div>
            </section>

            {rootFolder && (
                <section className={styles['import']}>
                    <div className={styles['import__header']}>
                        <h2>Nouveaux cours / mises à jour disponibles ({scannedCourses.length})</h2>
                        <Button
                            onClick={scanRootFolder}
                            disabled={scanCoursesIsLoading}
                            variant="text"
                        >
                            <RefreshCw />
                            Rafraîchir
                        </Button>
                        <Button
                            // onClick={handleImportAllCourses}
                            disabled={scanCoursesIsLoading || scannedCourses.length === 0}
                            variant="text"
                        >
                            <CircleArrowDown />
                            Tout importer
                        </Button>
                    </div>

                    <div className={styles['import__content']}>
                        {selectFolderIsLoading ? (
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
            )}
            <section className={styles['imported']}>
                <div className={styles['imported__header']}>
                    <h2>Cours importés dans la base de données ({importedCourses.length})</h2>
                </div>
                <div className={styles['import__content']}>
                    {selectFolderIsLoading ? (
                        <p>Chargement...</p>
                    ) : importedCourses.length === 0 ? (
                        <p>Aucun cours importé dans la base de données.</p>
                    ) : (
                        <ul>
                            {importedCourses.map((course) => (
                                <ImportedCourseCard
                                    key={course.id}
                                    course={course}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    )
}
