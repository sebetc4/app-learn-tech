import styles from './RecentCourseCard.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { protocolService } from '@/renderer/src/services'
import { Link } from 'react-router-dom'

import { RecentCourseViewModel } from '@/types'

interface RecentCourseCardProps {
    course: RecentCourseViewModel
}

export const RecentCourseCard = ({ course }: RecentCourseCardProps) => {
    return (
        <Link
            className={styles.card}
            to={`${PAGE_PATH.COURSES}/${course.id}`}
        >
            <img
                src={protocolService.course.getIconPath(course.folderName)}
                alt={course.name}
                className={styles.icon}
            />
            <div className={styles.content}>
                <h3>{course.name}</h3>
                <p className={styles.accessDate}>
                    Last accessed: {new Date(course.accessedAt).toLocaleDateString()}
                </p>

                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${course.progressPercentage}%` }}
                        />
                    </div>
                    <span className={styles.progressText}>{course.progressPercentage}%</span>
                </div>
            </div>
        </Link>
    )
}
