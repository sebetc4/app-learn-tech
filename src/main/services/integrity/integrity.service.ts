import type { DatabaseService } from '../database'
import type { FolderService } from '../folder'
import fs from 'fs'
import path from 'path'

export interface IntegrityCheckResult {
    totalChecked: number
    deactivated: number
    deactivatedCourseIds: string[]
    rootPathRemoved: boolean
}

export class IntegrityService {
    #database: DatabaseService
    #folderService: FolderService

    constructor(database: DatabaseService, folderService: FolderService) {
        this.#database = database
        this.#folderService = folderService
    }

    async verifyCoursesIntegrity(): Promise<IntegrityCheckResult> {
        const result: IntegrityCheckResult = {
            totalChecked: 0,
            deactivated: 0,
            deactivatedCourseIds: [],
            rootPathRemoved: false
        }

        try {
            const rootPath = this.#folderService.rootPath

            // If no root path is set, skip integrity check
            if (!rootPath) {
                console.log('No root path set, skipping integrity check')
                return result
            }

            // Check if root path exists
            if (!fs.existsSync(rootPath)) {
                console.log(`Root path does not exist: ${rootPath}`)
                console.log('Removing root path from database and deactivating all courses')

                // Deactivate all active courses if root path is missing
                const activeCourses = await this.#database.course.getAll()
                result.totalChecked = activeCourses.length

                for (const course of activeCourses) {
                    await this.#database.course.softDelete(course.id)
                    result.deactivated++
                    result.deactivatedCourseIds.push(course.id)
                }

                // Remove root path from database
                await this.#folderService.removeRootPath()
                result.rootPathRemoved = true

                console.log(
                    `Integrity check complete: Root path removed, ${result.deactivated} course(s) deactivated`
                )
                return result
            }

            // Get all active courses from database
            const activeCourses = await this.#database.course.getAll()
            result.totalChecked = activeCourses.length

            console.log(`Checking integrity of ${activeCourses.length} courses...`)

            // Check each course for folder existence
            for (const course of activeCourses) {
                const courseDirPath = path.join(rootPath, course.id)

                if (!fs.existsSync(courseDirPath)) {
                    console.log(`Course folder missing for: ${course.name} (${course.id})`)

                    // Soft delete the course
                    await this.#database.course.softDelete(course.id)

                    result.deactivated++
                    result.deactivatedCourseIds.push(course.id)
                }
            }

            if (result.deactivated > 0) {
                console.log(
                    `Integrity check complete: ${result.deactivated} course(s) deactivated due to missing folders`
                )
            } else {
                console.log('Integrity check complete: All courses have valid folders')
            }

            return result
        } catch (error) {
            console.error('Error during integrity check:', error)
            throw error
        }
    }
}
