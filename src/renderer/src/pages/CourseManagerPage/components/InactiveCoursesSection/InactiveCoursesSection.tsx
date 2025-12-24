import styles from './InactiveCoursesSection.module.scss'
import { InactiveCourseCard } from './components'
import { useCoursesStore } from '@/renderer/src/store'
import { FC, useEffect } from 'react'

export const InactiveCoursesSection: FC = () => {
    const inactiveCourses = useCoursesStore((state) => state.inactiveCourses)
    const fetchInactiveCourses = useCoursesStore((state) => state.fetchInactiveCourses)

    useEffect(() => {
        fetchInactiveCourses()
    }, [fetchInactiveCourses])

    if (inactiveCourses.length === 0) {
        return null
    }

    return (
        <section className={styles.inactive}>
            <div className={styles['inactive__header']}>
                <h2>Inactive courses ({inactiveCourses.length})</h2>
                <p className={styles['inactive__description']}>
                    These courses are in the database but their folders are missing
                </p>
            </div>
            <div className={styles['inactive__content']}>
                <ul>
                    {inactiveCourses.map((course) => (
                        <InactiveCourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </ul>
            </div>
        </section>
    )
}
