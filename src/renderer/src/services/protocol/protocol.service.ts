import { CourseProtocolManager, IconProtocolManager } from './managers'

class ProtocolService {
    #courseProtocolManager: CourseProtocolManager
    #iconProtocolManager: IconProtocolManager

    get course() {
        return this.#courseProtocolManager
    }

    get icon() {
        return this.#iconProtocolManager
    }

    constructor() {
        this.#courseProtocolManager = new CourseProtocolManager()
        this.#iconProtocolManager = new IconProtocolManager()
    }
}

export const protocolService = new ProtocolService()
