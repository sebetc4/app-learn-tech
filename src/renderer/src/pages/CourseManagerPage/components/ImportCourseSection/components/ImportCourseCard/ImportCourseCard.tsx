import styles from './ImportCourseCard.module.scss'
import { Button } from '@/renderer/src/components'
import { protocolService } from '@/renderer/src/services'
import { useCourseFolderStore, useCoursesStore } from '@/renderer/src/store'
import { CircleFadingArrowUp, SquarePlus } from 'lucide-react'
import { FC, useState } from 'react'

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
    const isLoading = useCourseFolderStore((state) => state.isLoading)

    const [cardIsLoading, setCardIsLoading] = useState(false)

    const handleAddCourse = async () => {
        setCardIsLoading(true)
        await addCourse(directory)
        setCardIsLoading(false)
    }

    const handleUpdateCourse = async () => {
        setCardIsLoading(true)
        await updateCourse(directory)
        setCardIsLoading(false)
    }

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
                    <Button
                        onClick={handleAddCourse}
                        disabled={isLoading}
                        isLoading={cardIsLoading}
                    >
                        Ajouter
                    </Button>
                ) : (
                    <Button
                        onClick={handleUpdateCourse}
                        disabled={isLoading}
                        isLoading={cardIsLoading}
                    >
                        Mettre à jour
                    </Button>
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
