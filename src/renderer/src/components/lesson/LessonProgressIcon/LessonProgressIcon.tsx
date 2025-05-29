import styles from './LessonProgressIcon.module.scss'
import clsx from 'clsx'
import { Badge, BadgeCheck } from 'lucide-react'
import { FC } from 'react'

import { ProgressLessonViewModel } from '@/types'

interface LessonProgressIconProps {
    className?: string
    progress: ProgressLessonViewModel[]
}

export const LessonProgressIcon: FC<LessonProgressIconProps> = ({ progress, className }) => {
    if (progress.length === 0) {
        return <Badge className={clsx(styles['progress-icon__base'], className)} />
    } else if (progress[0].status === 'IN_PROGRESS') {
        return <Badge className={clsx(styles['progress-icon__info'], className)} />
    } else if (progress[0].status === 'COMPLETED') {
        return <BadgeCheck className={clsx(styles['progress-icon__check'], className)} />
    } else {
        return <Badge className={clsx(styles['progress-icon__base'], className)} />
    }
}
