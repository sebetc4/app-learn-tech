import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

export const folderContextBridge = {
    // Root
    getRoot: () => ipcRenderer.invoke(IPC.FOLDER.GET_ROOT),
    setRoot: () => ipcRenderer.invoke(IPC.FOLDER.SET_ROOT),
    removeRoot: () => ipcRenderer.invoke(IPC.FOLDER.REMOVE_ROOT),
    // Archive
    importArchive: () => ipcRenderer.invoke(IPC.FOLDER.IMPORT_ARCHIVE),
    // Scan
    scan: () => ipcRenderer.invoke(IPC.FOLDER.SCAN),
}
