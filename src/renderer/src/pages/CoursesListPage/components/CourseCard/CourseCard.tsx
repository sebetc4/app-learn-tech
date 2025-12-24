import styles from './CourseCard.module.scss'
import { Button } from '@/renderer/src/components'
import { PAGE_PATH } from '@/renderer/src/constants'
import { protocolService } from '@/renderer/src/services'
import { BookOpen, PlayCircle } from 'lucide-react'
import { FC } from 'react'

import type { CourseViewModel } from '@/types'

interface CourseCardProps {
    course: CourseViewModel
}

export const CourseCard: FC<CourseCardProps> = ({ course }) => {
    const { id, name, description, progress, chapters } = course

    // Calculate total lessons
    const totalLessons = chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)

    // Calculate completed lessons
    const completedLessons = chapters.reduce(
        (acc, chapter) =>
            acc +
            chapter.lessons.filter((lesson) => lesson.progress?.status === 'COMPLETED').length,
        0
    )

    const progressPercentage = progress || 0
    const isStarted = progressPercentage > 0

    return (
        <article className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={protocolService.icon.getIconPath(id)}
                    alt={name}
                    className={styles.image}
                />
                {isStarted && (
                    <div className={styles.badge}>
                        <span>{progressPercentage}%</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{name}</h3>
                <p className={styles.description}>{description}</p>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <BookOpen size={16} />
                        <span>{chapters.length} chapters</span>
                    </div>
                    <div className={styles.stat}>
                        <PlayCircle size={16} />
                        <span>
                            {completedLessons}/{totalLessons} lessons
                        </span>
                    </div>
                </div>

                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                <Button
                    to={`${PAGE_PATH.COURSES}/${id}`}
                    variant="contained"
                    className={styles.button}
                >
                    {isStarted ? 'Continue' : 'Start Course'}
                </Button>
            </div>
        </article>
    )
}
