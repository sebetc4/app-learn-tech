import { DatabaseService } from '../database'
import AdmZip from 'adm-zip'
import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

import type {
    ChapterArchive,
    CodeSnippetArchive,
    CourseArchive,
    LessonArchive,
    ResourceArchive
} from '@/types'

export class CourseImporterService {
    #userDataPath: string
    #coursesPath: string
    #database: DatabaseService

    constructor(database: DatabaseService) {
        this.#userDataPath = app.getPath('userData')
        this.#coursesPath = path.join(this.#userDataPath, 'courses')
        this.#database = database

        if (!fs.existsSync(this.#coursesPath)) {
            fs.mkdirSync(this.#coursesPath, { recursive: true })
        }
    }

    public async importCourse(zipFilePath: string): Promise<string> {
        try {
            console.log(`Starting course import from ${zipFilePath}`)

            const zip = new AdmZip(zipFilePath)
            const metadataEntry = zip.getEntry('metadata.json')
            if (!metadataEntry) {
                throw new Error('metadata.json file not found in the archive')
            }

            const metadataContent = metadataEntry.getData().toString('utf8')
            const courseData: CourseArchive = JSON.parse(metadataContent)

            console.log(`Importing course "${courseData.name}" (ID: ${courseData.id})`)

            const coursePath = path.join(this.#coursesPath, courseData.id)
            if (!fs.existsSync(coursePath)) {
                fs.mkdirSync(coursePath, { recursive: true })
            }

            zip.extractAllTo(coursePath, true)

            await this.#addCourseToDatabase(courseData)

            console.log(`Course "${courseData.name}" successfully imported`)
            return courseData.id
        } catch (error) {
            console.error('Error during course import:', error)
            throw error
        }
    }

    async courseExists(courseId: string): Promise<boolean> {
        try {
            const course = await this.#database.course.getById(courseId)

            return course !== null
        } catch (error) {
            console.error('Error checking course existence:', error)
            throw error
        }
    }

    async removeCourse(courseId: string): Promise<void> {
        try {
            await this.#database.course.deleteById(courseId)

            const coursePath = path.join(this.#coursesPath, courseId)
            if (fs.existsSync(coursePath)) {
                fs.rmSync(coursePath, { recursive: true, force: true })
            }

            console.log(`Course ${courseId} successfully removed`)
        } catch (error) {
            console.error('Error removing course:', error)
            throw error
        }
    }

    async listCourses(): Promise<{ id: string; name: string }[]> {
        try {
            return await this.#database.course.getAll()
        } catch (error) {
            console.error('Error retrieving course list:', error)
            throw error
        }
    }

    async #addCourseToDatabase(courseData: CourseArchive): Promise<void> {
        try {
            const existingCourse = await this.#database.course.getById(courseData.id)

            if (existingCourse) {
                console.log(`Course ${courseData.name} already exists in the database`)
                await this.#updateExistingCourse(courseData)
            } else {
                await this.#createNewCourse(courseData)
            }
        } catch (error) {
            console.error('Error adding course to database:', error)
            throw error
        }
    }

    async #createNewCourse(courseData: CourseArchive): Promise<void> {
        try {
            await this.#database.course.create({
                id: courseData.id,
                name: courseData.name,
                description: courseData.description
            })

            for (const chapterData of courseData.chapters) {
                await this.#processChatper(courseData.id, chapterData)
            }

            console.log(`Course "${courseData.name}" created in database`)
        } catch (error) {
            console.error('Error creating course in database:', error)
            throw error
        }
    }

    #processChatper = async (courseId: string, chapterData: ChapterArchive): Promise<void> => {
        try {
            await this.#database.chapter.create({
                id: chapterData.id,
                name: chapterData.name,
                position: chapterData.position,
                courseId: courseId
            })

            for (const lessonData of chapterData.lessons) {
                await this.#processLesson(courseId, chapterData.id, lessonData)
            }

            console.log(`Chapter "${chapterData.name}" created in database`)
        } catch (error) {
            console.error('Error creating chapter in database:', error)
        }
    }

    #processLesson = async (courseId: string, chapterId: string, lessonData: LessonArchive) => {
        try {
            const lessonDir = path.join(this.#coursesPath, courseId, chapterId, lessonData.id)

            const assetPaths = this.#lessonAssetPaths(lessonDir, lessonData)

            await this.#database.lesson.create({
                id: lessonData.id,
                name: lessonData.name,
                position: lessonData.position,
                chapterId: chapterId,
                type: lessonData.type,
                ...assetPaths
            })

            await this.#processLessonCodeSnippets(lessonData.id, lessonData.codeSnippets)

            await this.#processLessonResources(lessonData.id, lessonData.resources)

            console.log(`Lesson "${lessonData.name}" created in database`)
        } catch (error) {
            console.error('Error creating lesson in database:', error)
        }
    }

    #lessonAssetPaths(
        lessonDir: string,
        lessonData: LessonArchive
    ): { htmlPath?: string; videoPath?: string } {
        if (lessonData.type === 'TEXT') {
            return {
                htmlPath: path.join(lessonDir, 'index.html')
            }
        } else if (lessonData.type === 'VIDEO') {
            return {
                videoPath: path.join(lessonDir, 'video.mp4')
            }
        } else if (lessonData.type === 'TEXT_AND_VIDEO') {
            return {
                htmlPath: path.join(lessonDir, 'index.html'),
                videoPath: path.join(lessonDir, 'video.mp4')
            }
        } else {
            throw new Error(`Unknown lesson type: ${lessonData.type}`)
        }
    }

    async #processLessonCodeSnippets(lessonId: string, codeSnippets: CodeSnippetArchive[]) {
        try {
            for (const codeSnippet of codeSnippets) {
                await this.#database.codeSnippet.create({
                    ...codeSnippet,
                    lessonId
                })
            }
            console.log(`Code snippets for lesson ${lessonId} processed`)
        } catch (error) {
            console.error('Error processing lesson code snippets:', error)
            throw error
        }
    }

    async #processLessonResources(lessonId: string, resources: ResourceArchive[]) {
        try {
            for (const resource of resources) {
                await this.#database.resource.create({
                    id: resource.id,
                    type: resource.type,
                    url: resource.url,
                    lessonId: lessonId
                })
            }
            console.log(`Resources for lesson ${lessonId} processed`)
        } catch (error) {
            console.error('Error processing lesson resources:', error)
            throw error
        }
    }

    async #updateExistingCourse(courseData: CourseArchive): Promise<void> {
        try {
            await this.#database.course.deleteById(courseData.id)

            await this.#createNewCourse(courseData)

            console.log(`Course "${courseData.name}" updated in database`)
        } catch (error) {
            console.error('Error updating course in database:', error)
            throw error
        }
    }
}
