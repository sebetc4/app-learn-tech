import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import { UserAPI } from '@/types/api/user-api'
import {
    SetCurrentUserIPCHandlerParams,
    UpdateUserThemeIPCHandlerParams
} from '@/types/ipc/user-ipc.types'

export const userContextBridge: UserAPI = {
    getCurrent: () => ipcRenderer.invoke(IPC.USER.GET_CURRENT_USER),
    setCurrentUser: (params: SetCurrentUserIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.USER.SET_CURRENT_USER, params),
    getOne: () => ipcRenderer.invoke(IPC.USER.GET_ONE),
    getAll: () => ipcRenderer.invoke(IPC.USER.GET_ALL),
    updateTheme: (params: UpdateUserThemeIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.USER.UPDATE_THEME, params)
}
