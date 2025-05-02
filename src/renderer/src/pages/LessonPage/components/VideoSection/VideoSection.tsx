import styles from './VideoSection.module.scss'
import { protocolService } from '@/renderer/src/services'
import { FC } from 'react'

interface VideoSectionProps {
    videoPath: string
}

export const VideoSection: FC<VideoSectionProps> = ({ videoPath }) => {
    return (
        <section className={styles.video}>
            <div className={styles['video__container']}>
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
                    onLoadStart={() => console.log('Chargement de la vidéo commencé')}
                    onLoadedMetadata={() => console.log('Métadonnées vidéo chargées')}
                    onCanPlay={() => console.log('Vidéo prête à être jouée')}
                >
                    <source
                        src={protocolService.course.getVideoPath(videoPath)}
                        type="video/mp4"
                    />
                </video>
            </div>
        </section>
    )
}
