import type { HomePageStats } from '../../hooks/useHomePageStats'
import { ProgressRing } from '../ProgressRing'
import { StatsCard } from '../StatsCard'
import styles from './StatsDashboard.module.scss'
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { FC } from 'react'

export interface StatsDashboardProps {
    stats: HomePageStats
}

export const StatsDashboard: FC<StatsDashboardProps> = ({ stats }) => {
    return (
        <section
            className={styles.section}
            data-section="stats"
        >
            <h2 className={styles.title}>Your Learning Overview</h2>

            <div className={styles.grid}>
                <div className={styles.statsCards}>
                    <StatsCard
                        icon={<BookOpen />}
                        label="Total Courses"
                        value={stats.totalCourses}
                        color="brand-blue"
                    />
                    <StatsCard
                        icon={<CheckCircle />}
                        label="Lessons Completed"
                        value={`${stats.completedLessons}/${stats.totalLessons}`}
                        color="brand-green"
                    />
                    <StatsCard
                        icon={<TrendingUp />}
                        label="Courses In Progress"
                        value={stats.coursesInProgress}
                        color="primary"
                    />
                    <StatsCard
                        icon={<Clock />}
                        label="Total Learning Hours"
                        value={Math.round(stats.totalLearningHours)}
                        color="secondary"
                    />
                </div>

                <div className={styles.progressContainer}>
                    <ProgressRing
                        progress={stats.overallProgress}
                        label="Overall Progress"
                    />
                </div>
            </div>
        </section>
    )
}
