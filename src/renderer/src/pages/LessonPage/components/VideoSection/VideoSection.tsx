import styles from './VideoSection.module.scss'
import { protocolService } from '@/renderer/src/services'
import { FC } from 'react'

interface VideoSectionProps {
    videoPath: string
}

export const VideoSection: FC<VideoSectionProps> = ({ videoPath }) => {
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
                        src={protocolService.course.getFilePath(videoPath)}
                        type="video/mp4"
                    />
                </video>
            </div>
        </section>
    )
}
