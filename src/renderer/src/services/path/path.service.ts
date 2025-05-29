import { PAGE_PATH } from '../../constants'

interface GetLessonPathParams {
    courseId: string
    chapterId: string
    lessonId: string
}

export class PathService {
    getLessonPath({ courseId, chapterId, lessonId }: GetLessonPathParams): string {
        return `${PAGE_PATH.COURSES}/${courseId}/${chapterId}/${lessonId}`
    }
}

export const pathService = new PathService()
