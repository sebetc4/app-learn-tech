import styles from './CoursesList.module.scss'
import { useCoursesStore } from '@/renderer/src/store'
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui'

export const CoursesList = () => {
    const courses = useCoursesStore((state) => state.courses)
    return (
        <ul className={styles.list}>
            {courses.map(({ id, name, iconPath }) => (
                <li key={id}>
                    <RadixNavigationMenu.Link asChild>
                        <a
                            className={styles.item}
                            href={'https://sebastien-etcheto.com'}
                        >
                            <img
                                src={iconPath}
                                alt={name}
                            />
                            <p className={styles['item__text']}>{name}</p>
                        </a>
                    </RadixNavigationMenu.Link>
                </li>
            ))}
        </ul>
    )
}
