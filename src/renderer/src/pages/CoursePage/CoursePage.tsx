import { protocolService } from '../../services'
import { useCurrentCourseStore, useUserStore } from '../../store'
import styles from './CoursePage.module.scss'
import { ChaptersAccordion } from './components'
import { FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const CoursePage: FC = () => {
    const { courseId } = useParams()
    const userId = useUserStore((state) => state.current.id)
    const course = useCurrentCourseStore((state) => state.course)
    const fetchCourse = useCurrentCourseStore((state) => state.fetchCourse)
    const [loading, setLoading] = useState(true)

    const handleFetchCourse = useCallback(
        async (courseId: string, userId: string) => {
            setLoading(true)
            await fetchCourse(courseId, userId)
            setLoading(false)
        },
        [fetchCourse]
    )

    useEffect(() => {
        if (!courseId) {
            console.error('Course ID is not defined')
            return
        }
        handleFetchCourse(courseId, userId)
    }, [courseId, userId, handleFetchCourse])


    const chapterNumber = course?.chapters?.length || 0
    const lessonNumber =
        course?.chapters?.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0) || 0

    return !loading && course ? (
        <div>
            <section className={styles.header}>
                <div className={styles['header__icon-container']}>
                    <img
                        src={protocolService.course.getIconPath(course.folderName)}
                        alt={course.name}
                    />
                </div>
                <div className={styles['header__text-container']}>
                    <h1>{course.name}</h1>
                    <p>{course.description}</p>
                    <div>
                        <p>{chapterNumber} Chapitres</p>
                        <p>{lessonNumber} Leçons</p>
                    </div>
                </div>
            </section>
            <section>
                <ChaptersAccordion
                    chapters={course.chapters}
                    courseId={course.id}
                />
            </section>
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
