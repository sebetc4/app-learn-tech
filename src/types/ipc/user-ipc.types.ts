import { UserViewModel, UserViewModelWithoutTheme } from '../view-model/user-view-model.types'
import { IPCHandlerReturnWithData } from './core-ipc.types'

import { CreateUserDto, Theme, UpdateUserDto } from '@/types'

export interface CreateUserIPCHandlerParams extends CreateUserDto {}

export interface CreateUserIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        user: UserViewModel
    }> {}

// Get Current User
export interface GetCurrentUserIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        user: UserViewModel
    }> {}

// Set Current User
export interface SetCurrentUserIPCHandlerParams {
    userId: string
}

export interface SetCurrentUserIPCHandlerReturn
    extends IPCHandlerReturnWithData<{
        user: UserViewModel
    }> {}

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

// Update User
export interface UpdateUserIPCHandlerParams {
    userId: string
    dto: UpdateUserDto
}

// Update Theme
export interface UpdateUserThemeIPCHandlerParams {
    userId: string
    theme: Theme
}

// Delete User
export interface DeleteUserIPCHandlerParams {
    userId: string
}
