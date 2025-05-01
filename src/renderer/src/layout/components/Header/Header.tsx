import styles from './Header.module.scss'
import { NavigationMenu, ThemeSelector } from './components'

export const Header = () => {
    return (
        <header className={styles.header}>
            <NavigationMenu />
            <ThemeSelector />
        </header>
    )
}
