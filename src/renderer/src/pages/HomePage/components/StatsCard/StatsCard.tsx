import styles from './StatsCard.module.scss'
import { FC, ReactNode } from 'react'

export interface StatsCardProps {
    icon: ReactNode
    label: string
    value: string | number
    color?: 'primary' | 'brand-green' | 'brand-blue' | 'secondary'
}

export const StatsCard: FC<StatsCardProps> = ({ icon, label, value, color = 'primary' }) => {
    return (
        <div className={styles.card}>
            <div
                className={styles.icon}
                data-color={color}
            >
                {icon}
            </div>
            <div className={styles.content}>
                <p className={styles.label}>{label}</p>
                <h3 className={styles.value}>{value}</h3>
            </div>
        </div>
    )
}
