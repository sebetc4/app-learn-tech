import styles from './CoursesListPage.module.scss'
import { CourseCard } from './components'
import { useUserStore } from '@renderer/store'
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { CourseViewModel } from '@/types'

export const CoursesListPage: FC = () => {
    const [courses, setCourses] = useState<CourseViewModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const user = useUserStore((state) => state.current)

    const fetchCourses = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await window.api.course.getAll()

            if (!response.success) {
                toast.error(response.message)
                return
            }

            // Fetch detailed data for each course to get progress
            const detailedCourses: CourseViewModel[] = []
            for (const coursePreview of response.data.courses) {
                const courseResponse = await window.api.course.getOne({
                    courseId: coursePreview.id,
                    userId: user.id
                })
                if (courseResponse.success) {
                    detailedCourses.push(courseResponse.data.course)
                }
            }

            setCourses(detailedCourses)
        } catch {
            toast.error('Failed to load courses')
        } finally {
            setIsLoading(false)
        }
    }, [user.id])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <p>Loading courses...</p>
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>No courses available</h2>
                <p>Import your first course to get started!</p>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>All Courses</h1>
                <p className={styles.subtitle}>Browse and access all your imported courses</p>
            </header>

            <div className={styles.grid}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}
            </div>
        </div>
    )
}
