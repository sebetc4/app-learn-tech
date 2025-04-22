import { type FC, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ScanResult {
    id: string
    name: string
    description: string
    imported: boolean
}

export const FolderCourseManager: FC = () => {
    const [rootFolder, setRootFolder] = useState<string | null>(null)
    const [scannedCourses, setScannedCourses] = useState<ScanResult[]>([])
    const [importedCourses, setImportedCourses] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (rootFolder) {
            loadImportedCourses()
        }
    }, [rootFolder])

    const handleSelectRootFolder = async () => {
        setIsLoading(true)
        try {
            const response = await window.api.course.
            if (response.success) {
                setRootFolder(response.path)
                toast.success(response.message)
                // Après avoir défini le dossier racine, scanner les cours disponibles
                scanCourses()
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Scanner les cours disponibles dans le dossier racine
    const scanCourses = async () => {
        setIsLoading(true)
        try {
            const response = await window.electron.invoke('scan-courses')
            if (response.success) {
                // Récupérer la liste des cours importés pour marquer ceux qui le sont déjà
                const dbCoursesResponse = await window.electron.invoke('list-imported-courses')
                const dbCourses = dbCoursesResponse.success ? dbCoursesResponse.courses : []

                // Marquer les cours déjà importés
                const coursesWithStatus = response.courses.map((course) => ({
                    ...course,
                    imported: dbCourses.some((dbCourse) => dbCourse.id === course.id)
                }))

                setScannedCourses(coursesWithStatus)
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Charger la liste des cours importés dans la BDD
    const loadImportedCourses = async () => {
        setIsLoading(true)
        try {
            const response = await window.electron.invoke('list-imported-courses')
            if (response.success) {
                setImportedCourses(response.courses)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Importer un cours spécifique
    const handleImportCourse = async (courseId: string) => {
        setIsLoading(true)
        try {
            const response = await window.electron.invoke('import-course', courseId)
            if (response.success) {
                toast.success(response.message)
                // Mettre à jour les listes
                loadImportedCourses()
                // Mettre à jour le statut d'importation dans la liste scannée
                setScannedCourses((prev) =>
                    prev.map((course) =>
                        course.id === courseId ? { ...course, imported: true } : course
                    )
                )
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Importer tous les cours
    const handleImportAllCourses = async () => {
        if (scannedCourses.length === 0) {
            toast.info('Aucun cours à importer.')
            return
        }

        setIsLoading(true)
        try {
            const response = await window.electron.invoke('import-all-courses')
            if (response.success) {
                toast.success(response.message)
                // Mettre à jour les listes
                loadImportedCourses()
                // Marquer tous les cours comme importés
                setScannedCourses((prev) => prev.map((course) => ({ ...course, imported: true })))
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Supprimer un cours de la base de données
    const handleRemoveCourse = async (courseId: string) => {
        if (
            confirm(
                'Êtes-vous sûr de vouloir supprimer ce cours de la base de données ? Les fichiers ne seront pas supprimés.'
            )
        ) {
            setIsLoading(true)
            try {
                const response = await window.electron.invoke('remove-course', courseId)
                if (response.success) {
                    toast.success(response.message)
                    // Mettre à jour les listes
                    loadImportedCourses()
                    // Mettre à jour le statut d'importation dans la liste scannée
                    setScannedCourses((prev) =>
                        prev.map((course) =>
                            course.id === courseId ? { ...course, imported: false } : course
                        )
                    )
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                toast.error(`Erreur: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="course-folder-manager">
            <h2>Gestionnaire de cours</h2>

            <div className="folder-selection">
                <h3>Dossier racine des cours</h3>
                <div className="folder-info">
                    {rootFolder ? (
                        <span className="folder-path">{rootFolder}</span>
                    ) : (
                        <span className="no-folder">Aucun dossier sélectionné</span>
                    )}
                    <button
                        onClick={handleSelectRootFolder}
                        disabled={isLoading}
                        className="select-folder-button"
                    >
                        {isLoading ? 'Chargement...' : 'Sélectionner un dossier'}
                    </button>
                </div>
            </div>

            {rootFolder && (
                <div className="course-lists">
                    <div className="scanned-courses">
                        <div className="header">
                            <h3>Cours disponibles ({scannedCourses.length})</h3>
                            <button
                                onClick={scanCourses}
                                disabled={isLoading}
                                className="scan-button"
                            >
                                Rafraîchir
                            </button>
                            <button
                                onClick={handleImportAllCourses}
                                disabled={isLoading || scannedCourses.length === 0}
                                className="import-all-button"
                            >
                                Tout importer
                            </button>
                        </div>

                        {isLoading ? (
                            <p>Chargement...</p>
                        ) : scannedCourses.length === 0 ? (
                            <p>Aucun cours trouvé dans le dossier sélectionné.</p>
                        ) : (
                            <ul className="course-list">
                                {scannedCourses.map((course) => (
                                    <li
                                        key={course.id}
                                        className="course-item"
                                    >
                                        <div className="course-info">
                                            <span className="course-name">{course.name}</span>
                                            <span className="course-description">
                                                {course.description}
                                            </span>
                                        </div>
                                        <div className="course-actions">
                                            {course.imported ? (
                                                <span className="imported-badge">Importé</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleImportCourse(course.id)}
                                                    disabled={isLoading}
                                                    className="import-button"
                                                >
                                                    Importer
                                                </button>
                                            )}
                                        </div>
                                    </li>
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
                            <ul className="course-list">
                                {importedCourses.map((course) => (
                                    <li
                                        key={course.id}
                                        className="course-item"
                                    >
                                        <span className="course-name">{course.name}</span>
                                        <button
                                            onClick={() => handleRemoveCourse(course.id)}
                                            disabled={isLoading}
                                            className="remove-button"
                                        >
                                            Supprimer
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
