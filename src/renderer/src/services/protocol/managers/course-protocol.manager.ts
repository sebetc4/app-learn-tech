export class CourseProtocolManager {
    getIconPath(courseDirName: string): string {
        return `course://${courseDirName}/icon.png`
    }

    getVideoPath(videoPath: string): string {
        return `course://${videoPath}`
    }

    
}
