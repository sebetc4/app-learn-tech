import path from 'path'

interface BasePathParams {
    courseId: string
    chapterId: string
    lessonId: string
}

interface GetJsXPathParams extends BasePathParams {}

interface GetCodeSnippetPathParams extends BasePathParams {
    fileName: string
}

export class PathService {
    getJsxPath({ courseId, chapterId, lessonId }: GetJsXPathParams): string {
        return path.join(courseId, 'chapters', chapterId, lessonId, 'CourseContent.jsx')
    }

    getCodeSnippetPath({
        courseId,
        chapterId,
        lessonId,
        fileName
    }: GetCodeSnippetPathParams): string {
        return path.join(courseId, 'chapters', chapterId, lessonId, 'code', fileName)
    }
}

export const pathService = new PathService()
