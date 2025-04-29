import styles from './CoursePage.module.scss'
import { ChaptersAccordion } from './components/Chapters/ChaptersAccordion'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { CourseViewModel } from '@/types'

export const CoursePage = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState<CourseViewModel | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchCourse = useCallback(async () => {
        if (!courseId) throw new Error('Course ID is required')
        const response = await window.api.course.getOne({ courseId })
        if (response.success) {
            setCourse(response.data.course)
        } else {
            console.error(`Error fetching course: ${response.message}`)
        }
        setLoading(false)
    }, [courseId])

    useEffect(() => {
        fetchCourse()
    }, [fetchCourse])

    const chapterNumber = course?.chapters?.length || 0
    const lessonNumber =
        course?.chapters?.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0) || 0

    return !loading && course ? (
        <div>
            <section className={styles.header}>
                <div className={styles['header__icon-container']}>
                    <img
                        src={course.iconPath}
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
                <ChaptersAccordion chapters={course.chapters} />
            </section>
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
