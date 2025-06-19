import { Theme } from '@/types'

export interface UserViewModel {
    id: string
    name: string
    theme: Theme
}

export type UserViewModelWithoutTheme = Omit<UserViewModel, 'theme'>
