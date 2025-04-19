// mediaHandler.ts
import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

export class MediaHandlerService {
    #userDataPath: string
    #coursesPath: string

    constructor() {
        this.#userDataPath = app.getPath('userData')
        this.#coursesPath = path.join(this.#userDataPath, 'courses')
    }

    getMediaPath(courseId: string, lessonId: string, fileName: string): string {
        const mediaPath = path.join(this.#coursesPath, courseId, lessonId, fileName)

        if (!fs.existsSync(mediaPath)) {
            throw new Error(`Media file not found: ${mediaPath}`)
        }

        return mediaPath
    }

    getLessonVideoPath(courseId: string, lessonId: string): string {
        const videoPath = this.getMediaPath(courseId, lessonId, `${lessonId}.mp4`)
        if (!fs.existsSync(videoPath)) {
            throw new Error(`Video file not found: ${videoPath}`)
        }
        return videoPath
    }

    getCodeSnippetPath(
        courseId: string,
        lessonId: string,
        snippetId: string,
        extension: string
    ): string {
        const snippetPath = path.join(
            this.#coursesPath,
            courseId,
            lessonId,
            'code',
            `${snippetId}.${extension}`
        )

        if (!fs.existsSync(snippetPath)) {
            throw new Error(`Code snippet file not found: ${snippetPath}`)
        }

        return snippetPath
    }

    getCodeSnippetContent(
        courseId: string,
        lessonId: string,
        snippetId: string,
        extension: string
    ): string {
        const snippetPath = this.getCodeSnippetPath(courseId, lessonId, snippetId, extension)
        return fs.readFileSync(snippetPath, 'utf8')
    }

    courseDirectoryExists(courseId: string): boolean {
        const coursePath = path.join(this.#coursesPath, courseId)
        return fs.existsSync(coursePath)
    }

    async getAvailableDiskSpace(): Promise<number> {
       // ToDo: Implement a real disk space check based on the OS
        try {
            return 1000000000 // 1 Go 
        } catch (error) {
            console.error("Error during disk space check:", error)
            throw error
        }
    }

    async getCourseSize(courseId: string): Promise<number> {
        try {
            const coursePath = path.join(this.#coursesPath, courseId)
            if (!fs.existsSync(coursePath)) {
                return 0
            }
            const calculateDirSize = async (dirPath: string): Promise<number> => {
                let size = 0
                const files = fs.readdirSync(dirPath)

                for (const file of files) {
                    const filePath = path.join(dirPath, file)
                    const stats = fs.statSync(filePath)

                    if (stats.isDirectory()) {
                        size += await calculateDirSize(filePath)
                    } else {
                        size += stats.size
                    }
                }

                return size
            }

            return await calculateDirSize(coursePath)
        } catch (error) {
            console.error(`Erreur lors du calcul de la taille du cours ${courseId}:`, error)
            throw error
        }
    }
}
