import styles from './ImportedCourseCard.module.scss'
import { protocolService } from '@/renderer/src/services'
import { useCoursesStore } from '@/renderer/src/store'
import { FC, useState } from 'react'

import type { CoursePreview } from '@/types'

interface ImportedCourseCardProps {
    course: CoursePreview
}

export const ImportedCourseCard: FC<ImportedCourseCardProps> = ({ course }) => {
    const { name, folderName, id } = course
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const hardDeleteCourse = useCoursesStore((state) => state.hardDeleteCourse)

    const handleDelete = async () => {
        setIsDeleting(true)
        await hardDeleteCourse(id)
        setIsDeleting(false)
        setIsDialogOpen(false)
    }

    return (
        <>
            <li className={styles.card}>
                <button
                    className={styles['card__delete-icon']}
                    onClick={() => setIsDialogOpen(true)}
                    title="Delete permanently"
                    aria-label="Delete course"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="10"
                            cy="10"
                            r="9"
                            fill="currentColor"
                        />
                        <path
                            d="M6 6L14 14M14 6L6 14"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                <img
                    src={protocolService.course.getIconPath(folderName)}
                    alt={course.name}
                    className={styles['card__icon']}
                />
                <div className={styles['card__content']}>
                    <h3>{name}</h3>
                </div>
            </li>

            {isDialogOpen && (
                <div
                    className={styles.dialog__overlay}
                    onClick={() => setIsDialogOpen(false)}
                >
                    <div
                        className={styles.dialog__content}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Delete permanently?</h3>
                        <p>
                            This will delete &quot;{name}&quot; from the database and file system.
                            All progress data will be lost. This action is irreversible.
                        </p>
                        <div className={styles.dialog__actions}>
                            <button
                                className={styles.dialog__cancel}
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.dialog__confirm}
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <svg
                                            className={styles.dialog__loader}
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeOpacity="0.25"
                                            />
                                            <path
                                                d="M12 2C6.47715 2 2 6.47715 2 12"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete permanently'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
