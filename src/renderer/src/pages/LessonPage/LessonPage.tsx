import styles from './LessonPage.module.scss'
import { Navigation, TextSection, VideoSection } from './components'
import { FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
        if (!courseId || !chapterId) throw new Error('Course ID, Chapter ID are required')
        const response = await window.api.lesson.getNavigationElement({ courseId, chapterId })
        console.log('response', response)
        if (response.success) {
            const { course, chapter } = response.data.navigationElement
            setNavigationElement({
                course: {
                    id: course.id,
                    name: course.name
                },
                chapter: {
                    id: chapter.id,
                    name: chapter.name,
                    position: chapter.position
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

    const fetchNavigationElementAndLesson = useCallback(async () => {
        try {
            await Promise.all([fetchNavigationElement(), fetchLesson()])
        } catch (error) {
            console.error(`Error fetching navigation element and lesson: ${error}`)
        }
    }, [fetchNavigationElement, fetchLesson])

    useEffect(() => {
        fetchNavigationElementAndLesson()
    }, [fetchNavigationElementAndLesson])
    return !loading && lesson ? (
        <div className={styles.container}>
            {navigationElement && (
                <Navigation
                    course={navigationElement.course}
                    chapter={navigationElement.chapter}
                    lesson={lesson}
                />
            )}
            <h1 className={styles.title}>{lesson.name}</h1>
            {lesson.type !== 'TEXT' && lesson.videoPath && (
                <VideoSection videoPath={lesson.videoPath} />
            )}
            {lesson.type !== 'VIDEO' && lesson.mdxPath && <TextSection mdxPath={lesson.mdxPath} />}
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
