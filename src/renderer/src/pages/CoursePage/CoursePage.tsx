import { useCurrentCourseStore, useUserStore } from '../../store'
import { ChaptersAccordion, HeaderSection } from './components'
import { FC, useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export const CoursePage: FC = () => {
    const { courseId } = useParams()
    const [searchParams] = useSearchParams()
    const chapterId = searchParams.get('chapterId')
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

    return !loading && course ? (
        <div>
            <HeaderSection course={course} />
            <section>
                <ChaptersAccordion
                    chapters={course.chapters}
                    courseId={course.id}
                    currentChapterId={chapterId}
                />
            </section>
        </div>
    ) : (
        <p>Chargement...</p>
    )
}
