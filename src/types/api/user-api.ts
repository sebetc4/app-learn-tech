import { GetOneCourseIPCHandlerParams, GetOneCourseIPCHandlerReturn } from '../ipc'
import {
    GetCurrentUserIPCHandlerReturn,
    SetCurrentUserIPCHandlerParams,
    UpdateUserThemeIPCHandlerParams
} from '../ipc/user-ipc.types'

export type UserAPI = {
    getCurrentUser: () => GetCurrentUserIPCHandlerReturn
    setCurrentUser: (params: SetCurrentUserIPCHandlerParams) => Promise<void>

    getOne: (params: GetOneCourseIPCHandlerParams) => GetOneCourseIPCHandlerReturn
    getAll: () => GetOneCourseIPCHandlerReturn

    updateTheme: (params: UpdateUserThemeIPCHandlerParams) => Promise<void>
}
