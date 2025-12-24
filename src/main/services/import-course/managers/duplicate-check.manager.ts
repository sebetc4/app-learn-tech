import { DatabaseService } from '../../database'
import { CourseMetadata, DuplicateCheckResult } from '@/types'

export class DuplicateCheckManager {
    #database: DatabaseService

    constructor(database: DatabaseService) {
        this.#database = database
    }

    async checkDuplicate(metadata: CourseMetadata): Promise<DuplicateCheckResult> {
        // Check for inactive course
        const inactiveCourse = await this.#database.course.getByIdIncludingInactive(metadata.id)

        if (inactiveCourse && !inactiveCourse.isActive) {
            return {
                canImport: true,
                action: 'reactivate',
                existingCourse: inactiveCourse,
                message: `Le cours "${metadata.name}" a été précédemment supprimé et sera réactivé`
            }
        }

        // Check for active course
        const existingCourse = await this.#database.course.getById(metadata.id)

        if (existingCourse) {
            return {
                canImport: false,
                action: 'reject',
                existingCourse,
                message: `Le cours "${metadata.name}" est déjà installé (version: ${existingCourse.buildAt})`
            }
        }

        // Not a duplicate - new course
        return {
            canImport: true,
            action: 'import',
            message: `Nouveau cours "${metadata.name}" prêt à être importé`
        }
    }
}
