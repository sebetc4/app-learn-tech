import styles from './LessonsList.module.scss'
import { LessonProgressIcon } from '@/renderer/src/components'
import { pathService } from '@/renderer/src/services'
import { LetterText, SquarePlay } from 'lucide-react'
import { FC, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { LessonInCourseViewModel } from '@/types'

interface LessonsListProps {
    courseId: string
    chapterId: string
    lessons: LessonInCourseViewModel[]
}

export const LessonsList: FC<LessonsListProps> = ({ courseId, chapterId, lessons }) => {
    const sortedLessons = [...lessons].sort((a, b) => a.position - b.position)

    return (
        <ul className={styles.list}>
            {sortedLessons.map((lesson) => (
                <li key={lesson.id}>
                    <Link
                        className={styles.item}
                        to={pathService.getLessonPath({
                            courseId,
                            chapterId,
                            lessonId: lesson.id
                        })}
                    >
                        <span className={styles['item__progress-icon']}>
                            <LessonProgressIcon progress={lesson.lessonProgress} />
                        </span>
                        <span className={styles.item__text}>
                            <span className={styles.item__position}>{`${lesson.position}. `}</span>
                            {lesson.name}
                        </span>
                        <span>{<LessonTypeIcons lesson={lesson} />}</span>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

interface LessonTypeIconsProps {
    lesson: LessonInCourseViewModel
}

const LessonTypeIcons: FC<LessonTypeIconsProps> = ({ lesson }) => {
    const videoDuration = useCallback(() => {
        const seconds = lesson.videoDuration
        if (seconds === null || seconds === undefined) {
            return null
        }
        if (!Number.isInteger(seconds) || seconds < 0) {
            throw new Error('La valeur doit être un entier positif')
        }

        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
        const formattedSeconds =
            remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

        return `${formattedMinutes}m${formattedSeconds}`
    }, [lesson.videoDuration])

    switch (lesson.type) {
        case 'VIDEO':
            return <SquarePlay />
        case 'TEXT':
            return <LetterText />
        case 'TEXT_AND_VIDEO':
            return (
                <span className={styles['text-and-video-icons']}>
                    <span className={styles['text-and-video-icons__video']}>
                        <SquarePlay />
                        {videoDuration && <span>{videoDuration()}</span>}
                    </span>
                    <LetterText />
                </span>
            )
        default:
            return null
    }
}
