import type {
    GetAllUsersIPCHandlerReturn,
    GetCurrentUserIPCHandlerReturn,
    GetOneUserIPCHandlerParams,
    GetOneUserIPCHandlerReturn,
    SetCurrentUserIPCHandlerParams,
    UpdateUserThemeIPCHandlerParams
} from '../ipc'

export type UserAPI = {
    getCurrent: () => GetCurrentUserIPCHandlerReturn
    setCurrentUser: (params: SetCurrentUserIPCHandlerParams) => Promise<void>

    getOne: (params: GetOneUserIPCHandlerParams) => GetOneUserIPCHandlerReturn
    getAll: () => GetAllUsersIPCHandlerReturn

    updateTheme: (params: UpdateUserThemeIPCHandlerParams) => Promise<void>
}
