import styles from './Navigation.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { FC } from 'react'
import { Link } from 'react-router-dom'

interface NavigationProps {
    course: {
        id: string
        name: string
    }
    chapter: {
        id: string
        name: string
        position: number
    }
    lesson: {
        id: string
        name: string
        position: number
    }
}

export const Navigation: FC<NavigationProps> = ({ course, chapter, lesson }) => {
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
