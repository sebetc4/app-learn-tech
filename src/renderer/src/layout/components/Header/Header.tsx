import styles from './Header.module.scss'
import { CoursesList, UserMenu } from './components'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useCoursesStore } from '@/renderer/src/store'
import { ChevronDown } from 'lucide-react'
import { NavigationMenu } from 'radix-ui'
import { Link } from 'react-router-dom'

export const Header = () => {
    const courses = useCoursesStore((state) => state.courses)

    return (
        <header className={styles.header}>
            <NavigationMenu.Root className={styles.root}>
                <NavigationMenu.List className={styles.menu}>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link asChild>
                            <Link
                                to={PAGE_PATH.HOME}
                                className={styles.link}
                            >
                                Home
                            </Link>
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                        <NavigationMenu.Trigger
                            className={styles.trigger}
                            disabled={courses.length === 0}
                        >
                            Courses
                            <ChevronDown
                                className={styles.chevron}
                                aria-hidden
                            />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className={styles.content}>
                            <CoursesList />
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                        <UserMenu />
                    </NavigationMenu.Item>
                    <NavigationMenu.Indicator className={styles.indicator}>
                        <div className={styles.arrow} />
                    </NavigationMenu.Indicator>
                </NavigationMenu.List>
                <div className={styles['viewport-container']}>
                    <NavigationMenu.Viewport className={styles.viewport} />
                </div>
            </NavigationMenu.Root>
        </header>
    )
}
