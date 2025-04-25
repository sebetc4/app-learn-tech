import { DatabaseService } from '../database'
import { ArchiveManager, CourseImportManager } from './managers'
import checkDiskSpace from 'check-disk-space'
import * as fs from 'fs'
import * as path from 'path'

import type { CourseMetadata, CourseMetadataAndPath } from '@/types'

export { ArchiveManager } from './managers'

export class CoursesFolderService {
    #database: DatabaseService
    #archiveManager: ArchiveManager
    #coureImportManager: CourseImportManager

    #rootFolderPath: string | null = null

    get rootFolderPath(): string | null {
        return this.#rootFolderPath
    }

    constructor(database: DatabaseService) {
        this.#database = database

        this.#archiveManager = new ArchiveManager()
        this.#coureImportManager = new CourseImportManager(this.#database)
    }

    async initialize() {
        this.#rootFolderPath = await this.#database.setting.get<string>('COURSES_ROOT_FOLDER')
    }

    /**
     * --------------------------------
     * Root
     * --------------------------------
     */
    async setRootFolderPath(rootPath: string) {
        await this.#database.setting.upsert('COURSES_ROOT_FOLDER', rootPath)
        this.#rootFolderPath = rootPath
    }

    async removeRootFolderPath() {
        await this.#database.setting.delete('COURSES_ROOT_FOLDER')
        this.#rootFolderPath = null
    }

    async getAvailableDiskSpace(): Promise<number> {
        if (!this.#rootFolderPath) {
            throw new Error('Root folder path is not set')
        }
        const diskInfo = await checkDiskSpace(this.#rootFolderPath)
        return diskInfo.free
    }

    /**
     * --------------------------------
     * Archive
     * --------------------------------
     */
    async importCourseArchive(zipFilePath: string): Promise<string> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            const rootPath = await this.#getRoot()

            const courseDir = await this.#archiveManager.extractArchive(zipFilePath, rootPath)

            const metadataPath = path.join(courseDir, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            console.log(`Importing course "${courseData.name}" (ID: ${courseData.id})`)

            await this.#coureImportManager.import(courseData)

            console.log(`Course "${courseData.name}" successfully imported`)
            return courseData.id
        } catch (error) {
            console.error(`Error during course import: ${error}`)
            throw error
        }
    }

    async scanForCourses(): Promise<CourseMetadataAndPath[]> {
        try {
            const rootPath = await this.#getRoot()

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

    async getCoursesAlreadyImported(): Promise<{ id: string; name: string }[]> {
        try {
            return await this.#database.course.getAll()
        } catch (error) {
            console.error(`Error retrieving course list: ${error}`)
            throw error
        }
    }

    async addOneCourse(courseDirName: string): Promise<string> {
        try {
            const rootPath = await this.#getRoot()
            const courseDir = path.join(rootPath, courseDirName)

            if (!fs.existsSync(courseDir)) {
                throw new Error(`Course directory ${courseDir} does not exist`)
            }

            const metadataPath = path.join(courseDir, 'metadata.json')
            if (!fs.existsSync(metadataPath)) {
                throw new Error(`metadata.json file not found in ${courseDir}`)
            }

            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            await this.#coureImportManager.import(courseData)

            return courseData.id
        } catch (error) {
            console.error(`Error adding course: ${error}`)
            throw error
        }
    }

    async removeCourse(courseDir: string): Promise<void> {
        try {
            const rootPath = await this.#getRoot()
            const coursePath = path.join(rootPath, courseDir)
            const metadataPath = path.join(coursePath, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            const course = await this.#database.course.getByName(courseData.name)
            if (!course) {
                throw new Error(`Course ${courseDir} not found in the database`)
            }

            await this.#database.course.deleteById(course.id)

            if (fs.existsSync(courseDir)) {
                fs.rmSync(courseDir, { recursive: true, force: true })
            }

            console.log(`Course ${course.id} successfully removed`)
        } catch (error) {
            console.error(`Error removing course: ${error}`)
            throw error
        }
    }

    async #getRoot(): Promise<string> {
        try {
            const rootPath = await this.#database.setting.get<string>('COURSES_ROOT_FOLDER')
            if (!rootPath) {
                throw new Error('The root folder for courses has not been set')
            }
            return rootPath
        } catch (error) {
            console.error(`Error retrieving root folder: ${error}`)
            throw error
        }
    }
}
