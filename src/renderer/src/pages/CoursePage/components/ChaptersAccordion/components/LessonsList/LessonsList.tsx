import styles from './LessonsList.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { FC } from 'react'
import { Link } from 'react-router-dom'

import { CourseViewModel } from '@/types'

interface LessonsListProps {
    courseId: string
    chapterId: string
    lessons: CourseViewModel['chapters'][0]['lessons']
}

export const LessonsList: FC<LessonsListProps> = ({ courseId, chapterId, lessons }) => {
    const sortedLessons = [...lessons].sort((a, b) => a.position - b.position)
    return (
        <ul className={styles.list}>
            {sortedLessons.map((lesson) => (
                <li key={lesson.id}>
                    <Link
                        className={styles.item}
                        to={`${PAGE_PATH.COURSES}/${courseId}/${chapterId}/${lesson.id}`}
                    >
                        <span className={styles.item__position}>{`${lesson.position}. `}</span>
                        {lesson.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
