import { useUserStore } from '@renderer/store'
import { useCallback, useEffect, useState } from 'react'

import type { CourseViewModel } from '@/types'

export interface HomePageStats {
    totalCourses: number
    coursesInProgress: number
    coursesCompleted: number
    totalLessons: number
    completedLessons: number
    overallProgress: number
    totalLearningHours: number
    currentStreak: number
}

export const useHomePageStats = () => {
    const [stats, setStats] = useState<HomePageStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const user = useUserStore((state) => state.current)

    const calculateStats = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Fetch all courses
            const coursesResponse = await window.api.course.getAll()
            if (!coursesResponse.success) {
                throw new Error(coursesResponse.message)
            }

            const allCourseIds = coursesResponse.data.courses.map((c) => c.id)

            // Fetch detailed data for each course
            const detailedCourses: CourseViewModel[] = []
            for (const courseId of allCourseIds) {
                const courseResponse = await window.api.course.getOne({ courseId, userId: user.id })
                if (courseResponse.success) {
                    detailedCourses.push(courseResponse.data.course)
                }
            }

            // Calculate statistics
            let totalLessons = 0
            let completedLessons = 0
            let totalLearningSeconds = 0
            let coursesInProgress = 0
            let coursesCompleted = 0

            detailedCourses.forEach((course) => {
                course.chapters.forEach((chapter) => {
                    chapter.lessons.forEach((lesson) => {
                        totalLessons++

                        // Count completed lessons
                        if (lesson.progress?.status === 'COMPLETED') {
                            completedLessons++
                        }

                        // Sum video durations
                        if (
                            (lesson.type === 'VIDEO' || lesson.type === 'TEXT_AND_VIDEO') &&
                            lesson.videoDuration
                        ) {
                            totalLearningSeconds += lesson.videoDuration
                        }
                    })
                })

                // Determine course status
                if (course.progress !== null) {
                    if (course.progress === 100) {
                        coursesCompleted++
                    } else if (course.progress > 0) {
                        coursesInProgress++
                    }
                }
            })

            // Calculate overall progress percentage
            const overallProgress =
                totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

            // Convert seconds to hours
            const totalLearningHours = totalLearningSeconds / 3600

            // TODO: Implement streak calculation based on lesson completion dates
            // For now, return 0 as we need access to completion timestamps
            const currentStreak = 0

            const computedStats: HomePageStats = {
                totalCourses: detailedCourses.length,
                coursesInProgress,
                coursesCompleted,
                totalLessons,
                completedLessons,
                overallProgress,
                totalLearningHours,
                currentStreak
            }

            setStats(computedStats)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load statistics')
        } finally {
            setIsLoading(false)
        }
    }, [user.id])

    useEffect(() => {
        calculateStats()
    }, [calculateStats])

    return { stats, isLoading, error, refetch: calculateStats }
}
