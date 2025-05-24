import { protocolService } from '@/renderer/src/services'
import { useLessonStore } from '@/renderer/src/store/lesson.store'
import { type FC } from 'react'

interface CourseImageProps {
    fileName: string
    alt: string
    width?: number
    height?: number
}

export const CourseImage: FC<CourseImageProps> = ({ fileName, ...restProps }) => {
    const courseId = useLessonStore((state) => state.course?.id)
    const chapterId = useLessonStore((state) => state.chapter?.id)
    const lessonId = useLessonStore((state) => state.lesson?.id)

    if (!courseId || !chapterId || !lessonId) {
        console.error('CourseImage: Missing courseId, chapterId, or lessonId')
        return null
    }

    return (
        <img
            src={protocolService.course.getImagePath(courseId, chapterId, lessonId, fileName)}
            {...restProps}
        />
    )
}
