import styles from './RecentCoursesSection.module.scss'
import { RecentCourseCard } from './components'
import { Carousel, CarouselContent, CarouselItem } from '@/renderer/src/components'
import Autoplay from 'embla-carousel-autoplay'

import { RecentCourseViewModel } from '@/types'

interface RecentCoursesSectionProps {
    recentCourses: RecentCourseViewModel[]
}

export const RecentCoursesSection = ({ recentCourses }: RecentCoursesSectionProps) => {
    return (
        <section className={styles.section}>
            <h2>Last courses</h2>

            {recentCourses.length === 0 ? (
                <p className={styles.empty}>No course started yet.</p>
            ) : (
                <Carousel
                    className={styles.carousel}
                    opts={{
                        align: 'start',
                        loop: true
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000
                        })
                    ]}
                >
                    <CarouselContent className={styles.carousel__content}>
                        {recentCourses.map((course) => (
                            <CarouselItem
                                key={course.id}
                                className={styles.carousel__item}
                            >
                                <RecentCourseCard course={course} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </section>
    )
}
