import styles from './ImportedCourseSection.module.scss'
import { ImportedCourseCard } from './components'
import { useCourseFolderStore, useCoursesStore } from '@/renderer/src/store'
import { FC } from 'react'

export const ImportedCourseSection: FC = () => {
    const importedCourses = useCoursesStore((state) => state.courses)
    const rootFolderScanLoading = useCourseFolderStore((state) => state.rootFolderScanLoading)

    return (
        <section className={styles.imported}>
            <div className={styles['imported__header']}>
                <h2>Cours importés dans la base de données ({importedCourses.length})</h2>
            </div>
            <div className={styles['imported__content']}>
                {rootFolderScanLoading ? (
                    <p>Chargement...</p>
                ) : importedCourses.length === 0 ? (
                    <p>Aucun cours importé dans la base de données.</p>
                ) : (
                    <ul>
                        {importedCourses.map((course) => (
                            <ImportedCourseCard
                                key={course.id}
                                course={course}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}
