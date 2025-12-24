import styles from './HeroSection.module.scss'
import iconImage from '@/renderer/src/assets/icon.png'
import { FC } from 'react'

export interface HeroSectionProps {
    userName: string
    currentStreak?: number
}

function getTimeBasedGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

export const HeroSection: FC<HeroSectionProps> = ({ userName, currentStreak }) => {
    const greeting = getTimeBasedGreeting()

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <img
                    src={iconImage}
                    alt="Learn Tech Logo"
                    className={styles.logo}
                />
                <div className={styles.text}>
                    <h1 className={styles.greeting}>
                        {greeting}, {userName}!
                    </h1>
                    <p className={styles.subtitle}>Ready to continue your learning journey?</p>
                    {currentStreak !== undefined && currentStreak > 0 && (
                        <div className={styles.streak}>
                            <span className={styles.streakIcon}>🔥</span>
                            <span>{currentStreak} day streak!</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
