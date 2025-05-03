export class CourseProtocolManager {
    getIconPath(courseDirName: string): string {
        return `course://${courseDirName}/icon.png`
    }

    getFilePath(videoPath: string): string {
        return `course://${videoPath}`
    }
}
