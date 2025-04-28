import { IconStorageManager } from './managers'
import { app } from 'electron'

export class StorageService {
    #storagePath: string

    #iconManager: IconStorageManager

    get icon() {
        return this.#iconManager
    }

    constructor() {
        this.#storagePath = app.getPath('userData')
        this.#iconManager = new IconStorageManager(this.#storagePath)
    }
}
