import styles from './Header.module.scss'
import { NavigationMenu, UserMenu } from './components'

export const Header = () => {
    return (
        <header className={styles.header}>
            <NavigationMenu />
            <UserMenu />
        </header>
    )
}
