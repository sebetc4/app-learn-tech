import styles from './NavigationMenu.module.scss'
import { CoursesList } from './components/CoursesList/CoursesList'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useCoursesStore } from '@/renderer/src/store'
import { ChevronDown } from 'lucide-react'
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui'
import { Link } from 'react-router-dom'

export const NavigationMenu = () => {
    const courses = useCoursesStore((state) => state.courses)

    return (
        <RadixNavigationMenu.Root className={styles.root}>
            <RadixNavigationMenu.List className={styles.menu}>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            to={PAGE_PATH.HOME}
                            className={styles.link}
                        >
                            Home
                        </Link>
                    </RadixNavigationMenu.Link>
                </RadixNavigationMenu.Item>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Trigger
                        className={styles.trigger}
                        disabled={courses.length === 0}
                    >
                        Courses
                        <ChevronDown
                            className={styles.chevron}
                            aria-hidden
                        />
                    </RadixNavigationMenu.Trigger>
                    <RadixNavigationMenu.Content className={styles.content}>
                        <CoursesList />
                    </RadixNavigationMenu.Content>
                </RadixNavigationMenu.Item>
            </RadixNavigationMenu.List>
            <div className={styles['viewport-container']}>
                <RadixNavigationMenu.Viewport className={styles.viewport} />
            </div>
        </RadixNavigationMenu.Root>
    )
}
