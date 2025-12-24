import styles from './QuickActions.module.scss'
import { Button } from '@/renderer/src/components'
import { BookOpen, Play, Upload } from 'lucide-react'
import { FC } from 'react'

interface QuickActionsProps {
    lastLessonPath?: string
}

export const QuickActions: FC<QuickActionsProps> = ({ lastLessonPath }) => {
    return (
        <section className={styles.section}>
            <div className={styles.grid}>
                <Button
                    icon={<Play size={20} />}
                    variant="contained"
                    to={lastLessonPath || '/courses'}
                    className={styles.button}
                >
                    Continue Learning
                </Button>
                <Button
                    icon={<BookOpen size={20} />}
                    variant="outlined"
                    to="/courses"
                    className={styles.button}
                >
                    Browse Courses
                </Button>
                <Button
                    icon={<Upload size={20} />}
                    variant="outlined"
                    to="/course-manager"
                    className={styles.button}
                >
                    Import Course
                </Button>
            </div>
        </section>
    )
}
