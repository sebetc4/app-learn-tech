import { DatabaseService } from '../database'
import checkDiskSpace from 'check-disk-space'
import * as fs from 'fs'
import * as path from 'path'

import type { CourseMetadata, CourseMetadataAndPath } from '@/types'

export class FolderService {
    #database: DatabaseService

    #rootPath: string | null = null

    get rootPath(): string | null {
        return this.#rootPath
    }

    constructor(database: DatabaseService) {
        this.#database = database
    }

    async initialize() {
        try {
            this.#rootPath = await this.#database.setting.get<string>('COURSES_ROOT_FOLDER')
        } catch (error) {
            console.error(`Error initializing root path: ${error}`)
            throw error
        }
    }

    async setRootPath(rootPath: string) {
        try {
            await this.#database.setting.upsert('COURSES_ROOT_FOLDER', rootPath)
            this.#rootPath = rootPath
        } catch (error) {
            console.error(`Error setting root path: ${error}`)
            throw error
        }
    }

    async removeRootPath() {
        try {
            await this.#database.setting.delete('COURSES_ROOT_FOLDER')
            this.#rootPath = null
        } catch (error) {
            console.error(`Error removing root path: ${error}`)
            throw error
        }
    }

    async getAvailableDiskSpace(): Promise<number> {
        try {
            if (!this.#rootPath) {
                throw new Error('Root folder path is not set')
            }
            const diskInfo = await checkDiskSpace(this.#rootPath)
            return diskInfo.free
        } catch (error) {
            console.error(`Error checking disk space: ${error}`)
            throw error
        }
    }

    async scanForCourses(): Promise<CourseMetadataAndPath[]> {
        try {
            const rootPath = await this.#database.setting.get<string>('COURSES_ROOT_FOLDER')
            if (!rootPath) {
                throw new Error('The root folder for courses has not been set')
            }

            const courses: CourseMetadataAndPath[] = []

            const rootDirs = fs.readdirSync(rootPath, { withFileTypes: true })

            for (const dir of rootDirs) {
                if (dir.isDirectory()) {
                    const courseDirPath = path.join(rootPath, dir.name)
                    const metadataPath = path.join(courseDirPath, 'metadata.json')

                    if (fs.existsSync(metadataPath)) {
                        try {
                            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
                            const courseMetadata: CourseMetadata = JSON.parse(metadataContent)
                            courses.push({
                                metadata: courseMetadata,
                                path: courseDirPath
                            })
                            console.log(
                                `Course found: ${courseMetadata.name} (ID: ${courseMetadata.id})`
                            )
                        } catch (error) {
                            console.error(
                                `Error reading metadata.json file in ${courseDirPath}:`,
                                error
                            )
                        }
                    }
                }
            }
            return courses
        } catch (error) {
            console.error(`Error scanning for courses: ${error}`)
            throw error
        }
    }
}
