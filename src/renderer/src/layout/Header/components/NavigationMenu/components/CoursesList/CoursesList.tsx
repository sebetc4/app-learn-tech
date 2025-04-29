import styles from './CoursesList.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
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
                            href={`${PAGE_PATH.COURSES}/${id}`}
                        >
                            <img
                                src={iconPath}
                                alt={name}
                            />
                            <span className={styles['item__text']}>{name}</span>
                        </a>
                    </RadixNavigationMenu.Link>
                </li>
            ))}
        </ul>
    )
}
