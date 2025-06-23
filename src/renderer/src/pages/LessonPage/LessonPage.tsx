import { useLessonStore, useUserStore } from '../../store'
import styles from './LessonPage.module.scss'
import { FooterSection, NavigationSection, TextSection, VideoSection } from './components'
import { ResourceSection } from './components/ResourcesSection/ResourceSection'
import { type FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const LessonPage: FC = () => {
    const { courseId, chapterId, lessonId } = useParams()
    if (!courseId || !chapterId || !lessonId) {
        throw new Error('Course ID, Chapter ID, and Lesson ID are required')
    }

    const lesson = useLessonStore((state) => state.lesson)
    const userId = useUserStore((state) => state.current.id)
    const initializeLessonData = useLessonStore((state) => state.initialize)
    const [loading, setLoading] = useState(true)

    const fetchLessonData = useCallback(async () => {
        setLoading(true)
        await initializeLessonData(courseId, chapterId, lessonId, userId)
        setLoading(false)
    }, [courseId, chapterId, lessonId, userId, initializeLessonData])

    useEffect(() => {
        fetchLessonData()
    }, [fetchLessonData])

    return !loading && lesson ? (
        <div className={styles.container}>
            <NavigationSection />
            <h1 className={styles.title}>{lesson.name}</h1>
            {lesson.type !== 'TEXT' && <VideoSection />}
            {lesson.type !== 'VIDEO' && <TextSection />}
            {lesson.resources.length > 0 && <ResourceSection />}
            <FooterSection courseId={courseId} />
        </div>
    ) : (
        <p>Loading...</p>
    )
}
