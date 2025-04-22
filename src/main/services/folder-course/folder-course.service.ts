import { DatabaseService } from '../database'
import { CourseImportManager } from './managers'
import { ArchiveManager } from './managers/archive.manager'
import { CoursesFolder } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

import type { CourseMetadata } from '@/types'

export { ArchiveManager } from './managers'

export class FolderCourseService {
    #coursesRootPath: CoursesFolder[] = []
    #database: DatabaseService

    #archiveManager: ArchiveManager
    #coureImportManager: CourseImportManager

    get coursesRootPath(): CoursesFolder[] {
        return this.#coursesRootPath
    }

    constructor(database: DatabaseService) {
        this.#database = database

        this.#archiveManager = new ArchiveManager()
        this.#coureImportManager = new CourseImportManager(this.#database)
    }

    async addCoursesRootPath(path: string) {
        if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
            throw new Error(
                `The specified root folder does not exist or is not a directory: ${path}`
            )
        }

        await this.#database.coursesFolder.create({ path })
        console.log(`Root folder for courses set: ${path}`)
    }

    async deleteCoursesRootPath(id: string) {
        const folder = this.#coursesRootPath.find((folder) => folder.id === id)
        if (!folder) {
            throw new Error(`The specified root folder does not exist: ${id}`)
        }

        await this.#database.coursesFolder.deleteOneById(id)
        console.log(`Root folder for courses removed: ${id}`)
    }

    async scanForCourses(): Promise<CourseMetadata[]> {
        if (!this.#coursesRootPath.length) {
            throw new Error('The root folder for courses has not been set')
        }

        try {
            const courses: CourseMetadata[] = []

            for (const folder of this.#coursesRootPath) {
                const rootDirs = fs.readdirSync(folder.path, { withFileTypes: true })

                for (const dir of rootDirs) {
                    if (dir.isDirectory()) {
                        const courseDirPath = path.join(folder.path, dir.name)
                        const metadataPath = path.join(courseDirPath, 'metadata.json')

                        if (fs.existsSync(metadataPath)) {
                            try {
                                const metadataContent = fs.readFileSync(metadataPath, 'utf8')
                                const courseData: CourseMetadata = JSON.parse(metadataContent)
                                courses.push(courseData)
                                console.log(
                                    `Course found: ${courseData.name} (ID: ${courseData.id})`
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
            }
            return courses
        } catch (error) {
            console.error(`Error scanning for courses: ${error}`)
            throw error
        }
    }

    async importCourseArchive(zipFilePath: string): Promise<string> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            if (!this.#coursesRootPath) {
                throw new Error('The root folder for courses has not been set')
            }

            const coursePath = await this.#archiveManager.extractArchive(
                zipFilePath,
                this.#coursesRootPath[0].path
            )

            const metadataPath = path.join(coursePath, 'metadata.json')
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

    async listCourses(): Promise<{ id: string; name: string }[]> {
        try {
            return await this.#database.course.getAll()
        } catch (error) {
            console.error(`Error retrieving course list: ${error}`)
            throw error
        }
    }

    async removeCourse(courseDir: string): Promise<void> {
        try {
            if (!this.#coursesRootPath) {
                throw new Error('The root folder for courses has not been set')
            }
            const coursePath = path.join(this.#coursesRootPath, courseDir)
            const metadataPath = path.join(coursePath, 'metadata.json')
            const metadataContent = fs.readFileSync(metadataPath, 'utf8')
            const courseData: CourseMetadata = JSON.parse(metadataContent)

            const course = await this.#database.course.getByName(courseData.name)
            if (!course) {
                throw new Error(`Course ${courseDir} not found in the database`)
            }

            await this.#database.course.deleteById(course.id)

            if (fs.existsSync(coursePath)) {
                fs.rmSync(coursePath, { recursive: true, force: true })
            }

            console.log(`Course ${course.id} successfully removed`)
        } catch (error) {
            console.error(`Error removing course: ${error}`)
            throw error
        }
    }
}
