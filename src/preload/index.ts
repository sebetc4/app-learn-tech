import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';
import { courseContextBridge, mediaContextBridge, themeContextBridge } from './birdges';

const api = {
    course: courseContextBridge,
    media: mediaContextBridge,
    theme: themeContextBridge
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