import styles from './HomePage.module.scss'
import { RecentCoursesSection } from './components'
import { useUserStore } from '@renderer/store'
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { RecentCourseViewModel } from '@/types'

export const HomePage: FC = () => {
    const user = useUserStore((state) => state.current)
    const [recentCourses, setRecentCourses] = useState<RecentCourseViewModel[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchRecentCourses = useCallback(async () => {
        const response = await window.api.course.getRecent({ userId: user.id })
        if (response.success) {
            setRecentCourses(response.data.courses)
        } else {
            toast.error(response.message)
        }
        setIsLoading(false)
    }, [user.id])

    useEffect(() => {
        fetchRecentCourses()
    }, [fetchRecentCourses])

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <>
            <div className={styles.hero}>
                <h1>Hello {user.name}</h1>
            </div>
            <RecentCoursesSection recentCourses={recentCourses} />
        </>
    )
}
