export class CourseProtocolManager {
    getIconPath(courseDirName: string): string {
        return `course://${courseDirName}/icon.png`
    }

    getImagePath(
        courseDirName: string,
        chapterId: string,
        lessonId: string,
        fileName: string
    ): string {
        return `course://${courseDirName}/chapters/${chapterId}/${lessonId}/images/${fileName}`
    }

    getVideoPath(courseDirName: string, chapterId: string, lessonId: string): string {
        return `course://${courseDirName}/chapters/${chapterId}/${lessonId}/video.mp4`
    }
}
