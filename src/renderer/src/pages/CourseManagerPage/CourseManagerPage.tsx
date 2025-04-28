import { Button } from '../../components'
import { useCourseFolderStore, useCoursesStore } from '../../store'
import styles from './CourseManagerPage.module.scss'
import { ImportCourseCard, ImportedCourseCard } from './components'
import { CircleArrowDown, RefreshCw } from 'lucide-react'
import { FC, useEffect } from 'react'

export const CourseImporterPage: FC = () => {
    const rootFolder = useCourseFolderStore((state) => state.rootFolder)
    const scannedCourses = useCourseFolderStore((state) => state.scannedCourses)
    const isLoading = useCourseFolderStore((state) => state.isLoading)
    const handleSelectRootFolder = useCourseFolderStore((state) => state.handleSelectRootFolder)
    const scanRootFolder = useCourseFolderStore((state) => state.scan)

    const importedCourses = useCoursesStore((state) => state.courses)

    useEffect(() => {
        scanRootFolder()
    }, [scanRootFolder])

    return (
        <div className={styles.container}>
            <h1>Gestionnaire de cours</h1>

            <section className={styles['folder']}>
                <h2>Dossier racine des cours</h2>
                <div className={styles['folder__content']}>
                    {rootFolder ? (
                        <span>{rootFolder}</span>
                    ) : (
                        <span>Aucun dossier sélectionné</span>
                    )}
                    <Button
                        onClick={handleSelectRootFolder}
                        disabled={isLoading}
                        className="select-folder-button"
                    >
                        {isLoading ? 'Chargement...' : 'Sélectionner un dossier'}
                    </Button>
                </div>
            </section>

            {rootFolder && (
                <section className={styles['import']}>
                    <div className={styles['import__header']}>
                        <h2>Cours disponibles ({scannedCourses.length})</h2>
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
                        {isLoading ? (
                            <p>Chargement...</p>
                        ) : scannedCourses.length === 0 ? (
                            <p>Aucun cours trouvé dans le dossier sélectionné.</p>
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
                    {isLoading ? (
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
