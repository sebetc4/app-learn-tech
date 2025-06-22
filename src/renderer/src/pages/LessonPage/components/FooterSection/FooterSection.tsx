import styles from './FooterSection.module.scss'
import { pathService } from '@/renderer/src/services'
import { Button } from '@renderer/components'
import { useLessonStore, useUserStore } from '@renderer/store'
import { ArrowBigRight } from 'lucide-react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface FooterSectionProps {
    courseId: string
}

export const FooterSection: FC<FooterSectionProps> = ({ courseId }) => {
    const status = useLessonStore((state) => state.lesson?.progress?.status)
    const userId = useUserStore((state) => state.current.id)
    const validateLesson = useLessonStore((state) => state.validate)
    const adjacentLessons = useLessonStore((state) => state.adjacentLessons)
    const navigate = useNavigate()

    const handleClick = async () => {
        await validateLesson(courseId, userId)
        if (adjacentLessons?.next) {
            navigate(
                pathService.getLessonPath({
                    courseId,
                    chapterId: adjacentLessons.next.chapterId,
                    lessonId: adjacentLessons.next.id
                })
            )
        }
    }
    return (
        adjacentLessons?.next && (
            <section className={styles.section}>
                <Button
                    onClick={handleClick}
                    icon={<ArrowBigRight />}
                    iconPosition="end"
                >
                    {status === 'COMPLETED' ? 'Leçon suivante' : 'Leçon terminée'}
                </Button>
            </section>
        )
    )
}
