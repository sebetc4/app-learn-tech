import type {
    CreateUserIPCHandlerParams,
    CreateUserIPCHandlerReturn,
    DeleteUserIPCHandlerParams,
    GetAllUsersIPCHandlerReturn,
    GetCurrentUserIPCHandlerReturn,
    GetOneUserIPCHandlerParams,
    GetOneUserIPCHandlerReturn,
    SetCurrentUserIPCHandlerParams,
    SetCurrentUserIPCHandlerReturn,
    UpdateUserIPCHandlerParams,
    UpdateUserThemeIPCHandlerParams
} from '../ipc'

export type UserAPI = {
    create: (params: CreateUserIPCHandlerParams) => CreateUserIPCHandlerReturn

    getCurrent: () => GetCurrentUserIPCHandlerReturn
    setCurrentUser: (params: SetCurrentUserIPCHandlerParams) => SetCurrentUserIPCHandlerReturn

    getOne: (params: GetOneUserIPCHandlerParams) => GetOneUserIPCHandlerReturn
    getAll: () => GetAllUsersIPCHandlerReturn

    update: (params: UpdateUserIPCHandlerParams) => Promise<void>
    updateTheme: (params: UpdateUserThemeIPCHandlerParams) => Promise<void>

    delete: (params: DeleteUserIPCHandlerParams) => Promise<void>
}
