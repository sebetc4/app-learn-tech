import { useLessonStore } from '../../store/lesson.store'
import styles from './LessonPage.module.scss'
import { Navigation, TextSection, VideoSection } from './components'
import { FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const LessonPage: FC = () => {
    const { courseId, chapterId, lessonId } = useParams()
    if (!courseId || !chapterId || !lessonId) {
        throw new Error('Course ID, Chapter ID, and Lesson ID are required')
    }

    const lesson = useLessonStore((state) => state.lesson)
    const initializeLessonData = useLessonStore((state) => state.initialize)
    const [loading, setLoading] = useState(true)

    const fetchLessonData = useCallback(async () => {
        setLoading(true)
        await initializeLessonData(courseId, chapterId, lessonId)
        setLoading(false)
    }, [courseId, chapterId, lessonId, initializeLessonData])

    useEffect(() => {
        fetchLessonData()
    }, [fetchLessonData])

    return !loading && lesson ? (
        <div className={styles.container}>
            <Navigation />
            <h1 className={styles.title}>{lesson.name}</h1>
            {lesson.type !== 'TEXT' && <VideoSection />}
            {lesson.type !== 'VIDEO' && <TextSection />}
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
