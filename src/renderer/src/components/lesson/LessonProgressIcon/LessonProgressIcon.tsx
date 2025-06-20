import styles from './LessonProgressIcon.module.scss'
import clsx from 'clsx'
import { Badge, BadgeCheck } from 'lucide-react'
import { FC } from 'react'

import { LessonProgressViewModel } from '@/types'

interface LessonProgressIconProps {
    className?: string
    progress: LessonProgressViewModel | null
}

export const LessonProgressIcon: FC<LessonProgressIconProps> = ({ progress, className }) => {
    if (!progress) {
        return <Badge className={clsx(styles['progress-icon__base'], className)} />
    } else if (progress.status === 'IN_PROGRESS') {
        return <Badge className={clsx(styles['progress-icon__info'], className)} />
    } else if (progress.status === 'COMPLETED') {
        return <BadgeCheck className={clsx(styles['progress-icon__check'], className)} />
    } else {
        return <Badge className={clsx(styles['progress-icon__base'], className)} />
    }
}
