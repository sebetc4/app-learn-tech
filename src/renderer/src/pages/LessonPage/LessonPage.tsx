import { FC, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { LessonViewModel } from '@/types'

export const LessonPage: FC = () => {
    const { courseId, chapterId, lessonId } = useParams()
    const [lesson, setCourse] = useState<LessonViewModel | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchLesson = useCallback(async () => {
        console.log(lessonId)
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
        <div>
            <p>{courseId}</p>
            <p>{chapterId}</p>
            <p>{lessonId}</p>
            <h1>Leçon {lesson.name}</h1>
            <p>{lesson.videoPath}</p>
            <video src=""></video>
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
