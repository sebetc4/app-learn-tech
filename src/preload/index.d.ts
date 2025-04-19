import { AppAPI } from '../types'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
    interface Window {
        electron: ElectronAPI
        api: AppAPI
    }
}
