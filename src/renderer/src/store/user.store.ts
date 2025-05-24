import { Theme } from '@prisma/client'
import { create } from 'zustand'

import { UserViewModel, UserViewModelWithoutTheme } from '@/types'

interface UserState {
    current: UserViewModel
    users: UserViewModelWithoutTheme[]
}

interface UserActions {
    initialize: () => Promise<void>
    updateTheme: (theme: Theme) => void
}

const initialState: UserState = {
    current: {
        id: '',
        name: '',
        theme: 'SYSTEM'
    },
    users: []
}

interface UserStore extends UserState, UserActions {}

export const useUserStore = create<UserStore>()((set, get) => ({
    ...initialState,

    initialize: async () => {
        const [currentUserResponse, allUsersResponse] = await Promise.all([
            window.api.user.getCurrent(),
            window.api.user.getAll()
        ])
        if (currentUserResponse.success && allUsersResponse.success) {
            set({
                current: {
                    ...currentUserResponse.data.user
                },
                users: allUsersResponse.data.users
            })
        }
    },

    updateTheme: async (theme: Theme) => {
        const { current } = get()
        window.api.user.updateTheme({ userId: current.id, theme })
        set({ current: { ...current, theme } })
    }
}))
