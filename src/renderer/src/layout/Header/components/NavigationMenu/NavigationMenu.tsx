import styles from './NavigationMenu.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui'
import { AnchorHTMLAttributes, forwardRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { CoursePreviewData } from '@/types'

export const NavigationMenu = () => {
    const [courses, setCourses] = useState<CoursePreviewData>([])

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await window.api.course.getAll()
            if (response.success) {
                setCourses(response.data.courses)
            } else {
                console.error('Failed to fetch courses:', response.message)
            }
        }
        fetchCourses()
    }, [])

    return (
        <RadixNavigationMenu.Root className={styles.root}>
            <RadixNavigationMenu.List className={styles.menu}>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            to={PAGE_PATH.HOME}
                            className="NavigationMenuLink"
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
                        <ul className={styles.list}>
                            {courses.map((course) => (
                                <ListItem
                                    key={course.id}
                                    href={`/course/${course.id}`}
                                    name={course.name}
                                />
                            ))}
                        </ul>
                    </RadixNavigationMenu.Content>
                </RadixNavigationMenu.Item>
                <RadixNavigationMenu.Item>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            to={PAGE_PATH.COURSE_IMPORTER}
                            className="NavigationMenuLink"
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

interface ListItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string
    name: string
}

const ListItem = forwardRef<HTMLAnchorElement, ListItemProps>(
    ({ className, name, ...props }, forwardedRef) => (
        <li>
            <RadixNavigationMenu.Link asChild>
                <a
                    className={clsx(styles.item, className)}
                    {...props}
                    ref={forwardedRef}
                >
                    <img
                        src="/icons/rust.png"
                        alt={name}
                    />
                    <p className={styles['item__text']}>{name}</p>
                </a>
            </RadixNavigationMenu.Link>
        </li>
    )
)
