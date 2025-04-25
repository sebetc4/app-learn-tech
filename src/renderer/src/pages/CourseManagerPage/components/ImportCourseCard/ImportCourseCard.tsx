import { FC } from 'react'

import type { CourseMetadata } from '@/types'

interface ImportCourseCardProps {
    metadata: CourseMetadata
}

export const ImportCourseCard: FC<ImportCourseCardProps> = ({ metadata }) => {
    return (
        <li className="course-card">
            <img
                src={`media://${metadata.id}/icon.png`}
                alt={metadata.name}
                className="course-image"
            />
            <div className="course-card-content">
                <h3 className="course-title">{metadata.name}</h3>
                <p className="course-description">{metadata.description}</p>
            </div>
        </li>
    )
}
