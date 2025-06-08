import styles from './ResourceSection.module.scss'
import { Button } from '@/renderer/src/components'
import { useLessonStore } from '@/renderer/src/store'

export const ResourceSection = () => {
    const resourses = useLessonStore((state) => state.lesson!.resources)
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Ressources</h2>
            {resourses
                .filter((r) => r.type === 'STACKBLITZ')
                .map((r) => (
                    <iframe
                        key={r.id}
                        title="StackBlitz Project"
                        className={styles.iframe}
                        sandbox="allow-scripts allow-same-origin"
                        src={r.url}
                    />
                ))}
            {resourses
                .filter((r) => r.type === 'GITHUB')
                .map((r) => (
                    <div
                        key={r.id}
                        className={styles.github}
                    >
                        <svg
                            className={styles['github__icon']}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <title>Github</title>
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <div>
                            <p>
                                <strong>Code sur Github</strong>
                            </p>
                            <Button
                                className="button-primary"
                                to="https://github.com/dymafr/react-chapitre11-http-effect"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Voir le code
                            </Button>
                        </div>
                    </div>
                ))}
        </section>
    )
}
