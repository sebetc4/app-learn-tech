import { PROTOCOL, STORAGE_FOLDER } from '@/constants'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export class IconStorageManager {
    readonly #ICON_EXTENSION = 'png'
    #iconStoragePath: string

    constructor(storagePath: string) {
        this.#iconStoragePath = path.join(storagePath, STORAGE_FOLDER.COURSE_ICON)

        if (!fs.existsSync(this.#iconStoragePath)) {
            fs.mkdirSync(this.#iconStoragePath, { recursive: true })
        }
    }

    async save(courseId: string, iconPath: string): Promise<string> {
        try {
            if (!fs.existsSync(iconPath)) {
                throw new Error(`Icon file not found: ${iconPath}`)
            }

            const iconName = `${courseId}.${this.#ICON_EXTENSION}`
            const internalIconPath = path.join(this.#iconStoragePath, iconName)

            fs.copyFileSync(iconPath, internalIconPath)

            return `${PROTOCOL.ICON}://${iconName}`
        } catch (error) {
            console.error(`Error saving course icon: ${error}`)
            throw error
        }
    }

    getIconPath(courseId: string): string {
        return path.join(this.#iconStoragePath, `${courseId}.${this.#ICON_EXTENSION}`)
    }

    async getIconUrl(courseId: string): Promise<string | null> {
        try {
            const iconPath = this.getIconPath(courseId)

            if (fs.existsSync(iconPath)) {
                return pathToFileURL(iconPath).toString()
            }

            return null
        } catch (error) {
            console.error(`Error getting course icon URL: ${error}`)
            return null
        }
    }

    async exists(courseId: string): Promise<boolean> {
        return fs.existsSync(this.getIconPath(courseId))
    }

    async delete(courseId: string): Promise<boolean> {
        try {
            const iconPath = this.getIconPath(courseId)

            if (fs.existsSync(iconPath)) {
                fs.unlinkSync(iconPath)
                return true
            }

            return false
        } catch (error) {
            console.error(`Error deleting course icon: ${error}`)
            throw error
        }
    }
}
