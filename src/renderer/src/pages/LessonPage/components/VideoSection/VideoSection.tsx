import styles from './VideoSection.module.scss'
import { protocolService } from '@/renderer/src/services'
import { useLessonStore } from '@/renderer/src/store/lesson.store'
import { FC } from 'react'

export const VideoSection: FC = () => {
    const courseId = useLessonStore((state) => state.course?.id)
    const chapterId = useLessonStore((state) => state.chapter?.id)
    const lessonId = useLessonStore((state) => state.lesson?.id)

    if (!courseId || !chapterId || !lessonId) {
        console.error('Navigation: Missing courseId, chapterId, or lessonId data')
        return null
    }

    return (
        <section className={styles.section}>
            <div className={styles['video-container']}>
                <video
                    width="100%"
                    height="100%"
                    controls
                    preload="metadata"
                    playsInline
                    autoPlay={false}
                    onError={(e) => {
                        console.error('Erreur de lecture vidéo:', e.currentTarget.error)
                    }}
                >
                    <source
                        src={protocolService.course.getFilePath(
                            courseId,
                            chapterId,
                            lessonId,
                            'video.mp4'
                        )}
                        type="video/mp4"
                    />
                </video>
            </div>
        </section>
    )
}
