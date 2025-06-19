import { UserViewModel, UserViewModelWithoutTheme } from '../view-model/user-view-model.types'
import { IPCHandlerReturnWithData } from './core-ipc.types'
import { Theme } from '@/types'

// Get Current User
export interface GetCurrentUserIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        user: UserViewModel
    }> {}

// Set Current User
export interface SetCurrentUserIPCHandlerParams {
    userId: string
}

// Get One
export interface GetOneUserIPCHandlerParams {
    userId: string
}

export interface GetOneUserIPCHandlerReturn
    extends IPCHandlerReturnWithData<{ user: UserViewModel }> {}

// Get All
export interface GetAllUsersIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        users: UserViewModelWithoutTheme[]
    }> {}

// Update Theme
export interface UpdateUserThemeIPCHandlerParams {
    userId: string
    theme: Theme
}
