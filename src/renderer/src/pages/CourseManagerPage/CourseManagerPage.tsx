import { useCourseFolderStore } from '../../store'
import styles from './CourseManagerPage.module.scss'
import { ImportCourseSection, ImportedCourseSection, RootFolderSection } from './components'
import { FC, useEffect } from 'react'

export const CourseImporterPage: FC = () => {
    const rootFolder = useCourseFolderStore((state) => state.rootFolder)
    const scanRootFolder = useCourseFolderStore((state) => state.scan)

    useEffect(() => {
        if (rootFolder) scanRootFolder()
    }, [rootFolder, scanRootFolder])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestionnaire de cours</h1>

            <RootFolderSection />
            {rootFolder && (
                <>
                    <ImportCourseSection />
                    <ImportedCourseSection />
                </>
            )}
        </div>
    )
}
