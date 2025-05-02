import { PAGE_PATH } from '../../constants'
import styles from './LessonPage.module.scss'
import { VideoSection } from './components'
import { FC, useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { LessonViewModel } from '@/types'

interface NavigationElement {
    course: {
        id: string
        name: string
    }
    chapter: {
        id: string
        name: string
        position: number
    }
}

export const LessonPage: FC = () => {
    const { courseId, chapterId, lessonId } = useParams()
    const [navigationElement, setNavigationElement] = useState<NavigationElement | null>(null)
    const [lesson, setCourse] = useState<LessonViewModel | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchNavigationElement = useCallback(async () => {
        if (!courseId || !chapterId)
            throw new Error('Course ID, Chapter ID are required')
        const response = await window.api.lesson.getNavigationElement({ courseId, chapterId })
        if (response.success) {
            setNavigationElement({
                course: {
                    id: response.data.course.id,
                    name: response.data.course.name
                },
                chapter: {
                    id: response.data.chapter.id,
                    name: response.data.chapter.name,
                    position: response.data.chapter.position
                }
            })
        } else {
            console.error(`Error fetching navigation element: ${response.message}`)
        }
    }, [courseId, chapterId])

    const fetchLesson = useCallback(async () => {
        if (!lessonId) throw new Error('Lesson ID is required')
        const response = await window.api.lesson.getOne({ lessonId })
        if (response.success) {
            setCourse(response.data.lesson)
        } else {
            console.error(`Error fetching course: ${response.message}`)
        }
        setLoading(false)
    }, [lessonId])

    useEffect(() => {
        fetchLesson()
    }, [fetchLesson])
    return !loading && lesson ? (
        <div className={styles.container}>
            {navigationElement && (
                <nav className={styles.navigation}>
                    <Link to={`${PAGE_PATH.COURSES}/${navigationElement.course.id}`}>
                        {navigationElement.course.name}
                    </Link>
                    <span>{' > '}</span>
                    <Link to={`${PAGE_PATH.COURSES}/${navigationElement.course.id}`}>
                        {`${navigationElement.chapter.position} ${navigationElement.chapter.name}`}
                    </Link>
                    <span>{' > '}</span>
                    <Link to={`${PAGE_PATH.COURSES}/${navigationElement.course.id}`}>
                        {`${lesson.position} ${lesson.name}`}
                    </Link>
                </nav>
            )}
            <h1>Leçon {lesson.name}</h1>
            <VideoSection videoPath={lesson.videoPath!} />
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
