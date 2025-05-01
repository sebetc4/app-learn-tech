import styles from './CoursesList.module.scss'
import { PAGE_PATH } from '@/renderer/src/constants'
import { useCoursesStore } from '@/renderer/src/store'
import { NavigationMenu as RadixNavigationMenu } from 'radix-ui'
import { Link } from 'react-router-dom'

export const CoursesList = () => {
    const courses = useCoursesStore((state) => state.courses)
    return (
        <ul className={styles.list}>
            {courses.map(({ id, name, iconPath }) => (
                <li key={id}>
                    <RadixNavigationMenu.Link asChild>
                        <Link
                            className={styles.item}
                            to={`${PAGE_PATH.COURSES}/${id}`}
                        >
                            <img
                                src={iconPath}
                                alt={name}
                            />
                            <span className={styles['item__text']}>{name}</span>
                        </Link>
                    </RadixNavigationMenu.Link>
                </li>
            ))}
        </ul>
    )
}
