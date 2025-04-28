import { STORAGE_FOLDER } from '@/constants'

export class CourseProtocolManager {
    getIconPath(courseId: string): string {
        return `file://${STORAGE_FOLDER.COURSE_ICON}/${courseId}.png`
    }
}
