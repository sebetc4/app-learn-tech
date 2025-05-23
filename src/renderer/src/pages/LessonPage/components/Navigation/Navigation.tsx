import styles from './Navigation.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useLessonStore } from '@/renderer/src/store/lesson.store'
import { ProgressLessonViewModel } from '@/types'
import { ArrowBigLeft, ArrowBigRight, Badge, BadgeCheck, BadgeInfo } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

export const Navigation: FC = () => {
    const course = useLessonStore((state) => state.course)
    const chapter = useLessonStore((state) => state.chapter)
    const lesson = useLessonStore((state) => state.lesson)
    const adjacentLessons = useLessonStore((state) => state.adjacentLessons)

    if (!course || !chapter || !lesson) {
        console.error('Navigation: Missing course, chapter, or lesson data')
        return null
    }

    return (
        <section>
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
            <div className={styles['adjacent-lessons']}>
                {adjacentLessons?.previous && (
                    <Link
                        className={styles['adjacent-lessons__link']}
                        to={`${PAGE_PATH.COURSES}/${course.id}/${adjacentLessons.previous.chapterId}/${adjacentLessons.previous.id}`}
                    >
                        <ArrowBigLeft />
                        {`${adjacentLessons.previous.position}. ${adjacentLessons.previous.name}`}
                    </Link>
                )}
                <LessonProgressIcon progress={lesson.lessonProgress} />
                {adjacentLessons?.next && (
                    <Link
                        className={styles['adjacent-lessons__link']}
                        to={`${PAGE_PATH.COURSES}/${course.id}/${adjacentLessons.next.chapterId}/${adjacentLessons.next.id}`}
                    >
                        {`${adjacentLessons.next.position}. ${adjacentLessons.next.name}`}
                        <ArrowBigRight />
                    </Link>
                )}
            </div>
        </section>
    )
}

interface LessonProgressIconProps {
    progress: ProgressLessonViewModel[]
}

const LessonProgressIcon: FC<LessonProgressIconProps> = ({ progress }) => {
    if (progress.length === 0) {
        return <Badge className={styles['progress-icon__base']} />
    } else if (progress[0].status === 'IN_PROGRESS') {
        return <BadgeInfo className={styles['progress-icon__info']} />
    } else if (progress[0].status === 'COMPLETED') {
        return <BadgeCheck className={styles['progress-icon__check']} />
    } else {
        return <Badge className={styles['progress-icon__base']} />
    }
}
