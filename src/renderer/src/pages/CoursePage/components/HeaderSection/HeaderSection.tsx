import styles from './HeaderSection.module.scss'
import { protocolService } from '@/renderer/src/services'
import { type FC } from 'react'

import type { CourseViewModel } from '@/types'

interface HeaderSectionProps {
    course: CourseViewModel
}

export const HeaderSection: FC<HeaderSectionProps> = ({ course }) => {
    const chapterNumber = course?.chapters?.length || 0
    const lessonNumber =
        course?.chapters?.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0) || 0
    const courseProgressPercentage = course?.courseProgresses?.[0]?.percentage || 0

    return (
        <section className={styles.section}>
            <div className={styles['icon-container']}>
                <img
                    src={protocolService.course.getIconPath(course.folderName)}
                    alt={course.name}
                />
            </div>
            <div className={styles['text-container']}>
                <h1>{course.name}</h1>
                <p>{course.description}</p>
                <div>
                    <p>{chapterNumber} Chapitres</p>
                    <p>{lessonNumber} Leçons</p>
                </div>
                <div className={styles['progress-container']}>
                    <div className={styles['progress-bar']}>
                        <div
                            style={{
                                transform: `scaleX(${courseProgressPercentage}%)`
                            }}
                        />
                    </div>
                    <p className={styles['progress-percentage']}>{courseProgressPercentage}%</p>
                </div>
            </div>
        </section>
    )
}
