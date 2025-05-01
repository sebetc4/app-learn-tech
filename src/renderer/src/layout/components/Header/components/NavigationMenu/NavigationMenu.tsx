import styles from './NavigationMenu.module.scss'
import { CoursesList } from './components/CoursesList/CoursesList'
import { PAGE_PATH } from '@/renderer/src/constants'
import { ChevronDown } from 'lucide-react'
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui'
import { Link } from 'react-router-dom'

export const NavigationMenu = () => {
    return (
        <RadixNavigationMenu.Root className={styles.root}>
            <RadixNavigationMenu.List className={styles.menu}>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            to={PAGE_PATH.HOME}
                            className={styles.link}
                        >
                            Accueil
                        </Link>
                    </RadixNavigationMenu.Link>
                </RadixNavigationMenu.Item>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Trigger className={styles.trigger}>
                        Cours
                        <ChevronDown
                            className={styles.chevron}
                            aria-hidden
                        />
                    </RadixNavigationMenu.Trigger>
                    <RadixNavigationMenu.Content className={styles.content}>
                        <CoursesList />
                    </RadixNavigationMenu.Content>
                </RadixNavigationMenu.Item>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            to={PAGE_PATH.COURSE_MANAGER}
                            className={styles.link}
                        >
                            Ajouter un cours
                        </Link>
                    </RadixNavigationMenu.Link>
                </RadixNavigationMenu.Item>
            </RadixNavigationMenu.List>
            <div className={styles['viewport-container']}>
                <RadixNavigationMenu.Viewport className={styles.viewport} />
            </div>
        </RadixNavigationMenu.Root>
    )
}
