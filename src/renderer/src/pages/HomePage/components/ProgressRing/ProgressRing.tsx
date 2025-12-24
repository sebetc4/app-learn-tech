import styles from './ProgressRing.module.scss'
import { FC } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export interface ProgressRingProps {
    progress: number
    label: string
    size?: number
    strokeWidth?: number
}

function getThemeColor(colorName: string): string {
    const root = document.documentElement
    const rgb = getComputedStyle(root).getPropertyValue(`--compress-color-${colorName}`)
    return rgb ? `rgb(${rgb})` : '#000000'
}

export const ProgressRing: FC<ProgressRingProps> = ({
    progress,
    label,
    size = 200,
    strokeWidth = 20
}) => {
    const data = [
        { name: 'Completed', value: progress },
        { name: 'Remaining', value: 100 - progress }
    ]

    const COLORS = {
        completed: getThemeColor('brand-green'),
        remaining: getThemeColor('base-3')
    }

    return (
        <div
            className={styles.container}
            style={{ width: size, height: size }}
        >
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={size / 2 - strokeWidth}
                        outerRadius={size / 2}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                    >
                        <Cell fill={COLORS.completed} />
                        <Cell fill={COLORS.remaining} />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className={styles.label}>
                <span className={styles.percentage}>{progress}%</span>
                <span className={styles.text}>{label}</span>
            </div>
        </div>
    )
}
