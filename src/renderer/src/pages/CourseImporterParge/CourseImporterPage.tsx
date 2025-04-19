import { CourseCard } from './components'
import { FC, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Course {
    id: string
    name: string
    description: string
}

interface CourseSize {
    size: number
    sizeMB: number
}

interface DiskSpace {
    availableSpace: number
    availableSpaceMB: number
}

export const CourseImporterPage: FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isImporting, setIsImporting] = useState<boolean>(false)
    const [diskSpace, setDiskSpace] = useState<DiskSpace | null>(null)
    const [courseSizes, setCourseSizes] = useState<Record<string, CourseSize>>({})

    useEffect(() => {
        loadCourses()
        checkDiskSpace()
    }, [])

    const loadCourses = async () => {
        setIsLoading(true)
        try {
            const response = await window.api.course.getAll()
            if (response.success) {
                setCourses(response.data.coursePreviewData)

                for (const course of response.data.coursePreviewData) {
                    loadCourseSize(course.id)
                }
            } else {
                toast.error(response.message)
            }
        } catch {
            toast.error('Erreur lors du chargement des cours')
        } finally {
            setIsLoading(false)
        }
    }

    const checkDiskSpace = async () => {
        try {
            const response = await window.api.media.checkDiskSpace()
            if (response.success) {
                setDiskSpace({
                    availableSpace: response.data.availableSpace,
                    availableSpaceMB: response.data.availableSpace / (1024 * 1024)
                })
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'espace disque:", error)
        }
    }

    const loadCourseSize = async (courseId: string) => {
        try {
            const response = await window.api.media.getCourseSize(courseId)
            if (response.success) {
                setCourseSizes((prev) => ({
                    ...prev,
                    [courseId]: {
                        size: response.data.size,
                        sizeMB: response.data.size / (1024 * 1024),
                        sizeGB: response.data.size / (1024 * 1024 * 1024)
                    }
                }))
            }
        } catch (error) {
            console.error(`Erreur lors du calcul de la taille du cours ${courseId}:`, error)
        }
    }

    const handleImportCourse = async () => {
        setIsImporting(true)
        try {
            const response = await window.api.course.import()
            if (response.success) {
                toast.success(response.message)
                await loadCourses()
                await checkDiskSpace()
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(`Erreur lors de l'importation du cours`)
        } finally {
            setIsImporting(false)
        }
    }

    const handleRemoveCourse = async (courseId: string, courseName: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseName}" ?`)) {
            setIsLoading(true)
            try {
                const response = await window.api.course.remove(courseId)
                if (response.success) {
                    toast.success(response.message)
                    await loadCourses()
                    await checkDiskSpace()
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                toast.error(`Erreur lors de la suppression du cours`)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className="course-importer-container">
            <div className="course-importer-header">
                <h1>Gestionnaire de cours</h1>

                {diskSpace && (
                    <div className="disk-space-info">
                        <span>Espace disque disponible: </span>
                        <strong>{diskSpace.availableSpaceMB} MB</strong>
                    </div>
                )}

                <button
                    className="import-button"
                    onClick={handleImportCourse}
                    disabled={isImporting || isLoading}
                >
                    {isImporting ? 'Importation en cours...' : 'Importer un cours'}
                </button>
            </div>

            {isLoading && !isImporting ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement des cours...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="empty-state">
                    <h3>Aucun cours disponible</h3>
                    <p>Importez des cours pour commencer à apprendre.</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            size={courseSizes[course.id]?.sizeMB || 0}
                            onRemove={() => handleRemoveCourse(course.id, course.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
