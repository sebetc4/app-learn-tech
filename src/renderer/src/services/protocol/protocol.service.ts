import { CourseProtocolManager } from './managers'

class ProtocolService {
    #courseProtocolManager: CourseProtocolManager

    get course() {
        return this.#courseProtocolManager
    }

    constructor() {
        this.#courseProtocolManager = new CourseProtocolManager()
    }
}

export const protocolService = new ProtocolService()
