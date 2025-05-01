export class CourseProtocolManager {
    getIconPath(courseDirName: string): string {
        return `course://${courseDirName}/icon.png`
    }
    // getVideoPath(chapterId: string, lessonId, videoName: string): string {
    //     return `course://${courseDirName}/chapters/${chpapterId}/${lessonId}/videos.mp4`
    // }
}
