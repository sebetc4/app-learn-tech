import styles from './ImportCourseCard.module.scss'
import { Button } from '@/renderer/src/components'
import { CircleFadingArrowUp, SquarePlus } from 'lucide-react'
import { FC } from 'react'

import type { CourseMetadata } from '@/types'

interface ImportCourseCardProps {
    metadata: CourseMetadata
    directory: string
    addCourse: (directory: string) => void
    upload: (directory: string) => void
    isNew?: boolean
}

export const ImportCourseCard: FC<ImportCourseCardProps> = ({
    metadata,
    directory,
    addCourse,
    upload,
    isNew = true
}) => {
    return (
        <li className={styles.card}>
            <img
                src={`media://${directory}/icon.png`}
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
                    <Button onClick={() => upload(directory)}>Mettre à jour</Button>
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
