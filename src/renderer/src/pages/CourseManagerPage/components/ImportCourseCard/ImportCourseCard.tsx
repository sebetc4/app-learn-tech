import styles from './ImportCourseCard.module.scss'
import { Button } from '@/renderer/src/components'
import { protocolService } from '@/renderer/src/services'
import { useCoursesStore } from '@/renderer/src/store'
import { CircleFadingArrowUp, SquarePlus } from 'lucide-react'
import { FC } from 'react'

import type { CourseMetadata } from '@/types'

interface ImportCourseCardProps {
    metadata: CourseMetadata
    directory: string
    isNew?: boolean
}

export const ImportCourseCard: FC<ImportCourseCardProps> = ({
    metadata,
    directory,
    isNew = true
}) => {
    const addCourse = useCoursesStore((state) => state.addCourse)
    const updateCourse = useCoursesStore((state) => state.updateCourse)

    return (
        <li className={styles.card}>
            <img
                src={protocolService.course.getIconPath(directory)}
                alt={metadata.name}
                className={styles['card__icon']}
            />
            <div className={styles['card__content']}>
                <h3>{metadata.name}</h3>
                <p>{metadata.description}</p>
            </div>
            <div className={styles['card__button-container']}>
                {isNew ? (
                    <Button onClick={() => addCourse(directory)}>Ajouter</Button>
                ) : (
                    <Button onClick={() => updateCourse(directory)}>Mettre à jour</Button>
                )}
            </div>
            {isNew ? (
                <SquarePlus className={styles['new-icon']} />
            ) : (
                <CircleFadingArrowUp className={styles['update-icon']} />
            )}
        </li>
    )
}
