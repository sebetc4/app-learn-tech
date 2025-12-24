import styles from './HomePage.module.scss'
import { HeroSection, QuickActions, RecentCoursesSection, StatsDashboard } from './components'
import { useHomePageStats } from './hooks/useHomePageStats'
import { useUserStore } from '@renderer/store'
import { FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { RecentCourseViewModel } from '@/types'

export const HomePage: FC = () => {
    const user = useUserStore((state) => state.current)
    const [recentCourses, setRecentCourses] = useState<RecentCourseViewModel[]>([])
    const [isLoadingCourses, setIsLoadingCourses] = useState(true)
    const { stats, isLoading: isLoadingStats } = useHomePageStats()

    const fetchRecentCourses = useCallback(async () => {
        const response = await window.api.course.getRecent({ userId: user.id })
        if (response.success) {
            setRecentCourses(response.data.courses)
        } else {
            toast.error(response.message)
        }
        setIsLoadingCourses(false)
    }, [user.id])

    useEffect(() => {
        fetchRecentCourses()
    }, [fetchRecentCourses])

    const isLoading = isLoadingCourses || isLoadingStats

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <p>Loading your dashboard...</p>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <HeroSection
                userName={user.name}
                currentStreak={stats?.currentStreak}
            />

            <QuickActions
                lastLessonPath={
                    recentCourses[0]?.id ? `/courses/${recentCourses[0].id}` : undefined
                }
            />

            {stats && <StatsDashboard stats={stats} />}

            <RecentCoursesSection recentCourses={recentCourses} />
        </div>
    )
}
