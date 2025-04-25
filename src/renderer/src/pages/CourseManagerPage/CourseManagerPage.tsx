import { Button } from '../../components'
import styles from './CourseManagerPage.module.scss'
import { ImportCourseCard } from './components'
import { CircleArrowDown, RefreshCw } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CourseMetadataAndPath } from '@/types'

export const CourseImporterPage: FC = () => {
    const [rootFolder, setRoot] = useState<string | null>(null)
    const [scannedCourses, setScannedCourses] = useState<CourseMetadataAndPath[]>([])
    const [importedCourses, setImportedCourses] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchResources = async () => {
        setIsLoading(true)
        try {
            await Promise.all([fetchRootFolder(), fetchImportedCourses()])
        } catch (error) {
            toast.error('Erreur lors du chargement des ressources')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchImportedCourses = async () => {
        setIsLoading(true)
        try {
            const response = await window.api.course.getAll()
            if (response.success) {
                setImportedCourses(response.data.courses)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error('Erreur lors du chargement des cours importés')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRootFolder = async () => {
        try {
            const response = await window.api.folder.getRoot()
            if (response.success) {
                setRoot(response.data.path)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error('Erreur lors de la récupération du dossier racine')
        }
    }

    useEffect(() => {
        fetchResources()
    }, [])

    useEffect(() => {
        if (rootFolder) scan()
    }, [rootFolder])

    const handleSelectRootFolder = async () => {
        setIsLoading(true)
        try {
            const response = await window.api.folder.setRoot()
            if (response.success) {
                setRoot(response.data.path)
                toast.success(response.message)
                scan()
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur lors de la sélection du dossier de cours`)
        } finally {
            setIsLoading(false)
        }
    }

    const scan = async () => {
        setIsLoading(true)
        try {
            const response = await window.api.folder.scan()
            if (response.success) {
                setScannedCourses(response.data.courses)
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error("Erreur lors de l'analyse des cours")
        } finally {
            setIsLoading(false)
        }
    }

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
                            onClick={scan}
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
                                {scannedCourses.map(({ metadata, path }) => (
                                    <ImportCourseCard
                                        key={metadata.id}
                                        metadata={metadata}
                                        path={path}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="imported-courses">
                        <h3>Cours importés dans la base de données ({importedCourses.length})</h3>
                        {isLoading ? (
                            <p>Chargement...</p>
                        ) : importedCourses.length === 0 ? (
                            <p>Aucun cours importé dans la base de données.</p>
                        ) : (
                            <p>{importedCourses.length} cours importés.</p>
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}
