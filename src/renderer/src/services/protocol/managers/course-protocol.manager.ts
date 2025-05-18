export class CourseProtocolManager {
    getIconPath(courseDirName: string): string {
        return `course://${courseDirName}/icon.png`
    }

    getFilePath(
        courseDirName: string,
        chapterId: string,
        lessonId: string,
        fileName: string
    ): string {
        return `course://${courseDirName}/chapters/${chapterId}/${lessonId}/${fileName}`
    }
}
