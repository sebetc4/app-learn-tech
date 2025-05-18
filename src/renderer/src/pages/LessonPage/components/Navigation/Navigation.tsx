import styles from './Navigation.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useLessonStore } from '@/renderer/src/store/lesson.store'
import { FC } from 'react'
import { Link } from 'react-router-dom'

export const Navigation: FC = () => {
    const course = useLessonStore((state) => state.course)
    const chapter = useLessonStore((state) => state.chapter)
    const lesson = useLessonStore((state) => state.lesson)

    if (!course || !chapter || !lesson) {
        console.error('Navigation: Missing course, chapter, or lesson data')
        return null
    }

    return (
        <nav className={styles.navigation}>
            <Link to={`${PAGE_PATH.COURSES}/${course.id}`}>{course.name}</Link>
            <span>{'>'}</span>
            <Link to={`${PAGE_PATH.COURSES}/${course.id}`}>
                {`${chapter.position}. ${chapter.name}`}
            </Link>
            <span>{'>'}</span>
            <Link to={`${PAGE_PATH.COURSES}/${course.id}`}>
                {`${lesson.position}. ${lesson.name}`}
            </Link>
        </nav>
    )
}
