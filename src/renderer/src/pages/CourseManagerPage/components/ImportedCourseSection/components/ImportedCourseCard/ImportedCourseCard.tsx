import styles from './ImportedCourseCard.module.scss'
import { protocolService } from '@/renderer/src/services'
import { FC } from 'react'

import type { CoursePreview } from '@/types'

interface ImportedCourseCardProps {
    course: CoursePreview
}

export const ImportedCourseCard: FC<ImportedCourseCardProps> = ({ course }) => {
    const { name, description, folderName } = course
    return (
        <li className={styles.card}>
            <img
                src={protocolService.course.getIconPath(folderName)}
                alt={course.name}
                className={styles['card__icon']}
            />
            <div className={styles['card__content']}>
                <h3>{name}</h3>
                <p>{description}</p>
            </div>
        </li>
    )
}
