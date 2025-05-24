import {
    courseContextBridge,
    folderContextBridge,
    lessonContextBridge,
    progressContextBridge,
    userContextBridge
} from './birdges'
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

const api = {
    course: courseContextBridge,
    folder: folderContextBridge,
    lesson: lessonContextBridge,
    user: userContextBridge,
    progress: progressContextBridge
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
