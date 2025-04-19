import { BookOpen, Link, Trash2 } from "lucide-react"

interface CourseCardProps {
    course: {
        id: string
        name: string
        description: string
    }
    size: number
    onRemove: () => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, size, onRemove }) => {
    return (
        <div className="course-card">
            <div className="course-card-content">
                <h3 className="course-title">{course.name}</h3>
                <p className="course-description">{course.description}</p>

                <div className="course-meta">
                    <span className="course-size">{size} MB</span>
                </div>
            </div>

            <div className="course-actions">
                <Link
                    to={`/courses/${course.id}`}
                    className="view-course-btn"
                >
                    <BookOpen />
                    <span>Ouvrir</span>
                </Link>

                <button
                    className="remove-course-btn"
                    onClick={(e) => {
                        e.preventDefault()
                        onRemove()
                    }}
                >
                    <Trash2 />
                    <span>Supprimer</span>
                </button>
            </div>
        </div>
    )
}
