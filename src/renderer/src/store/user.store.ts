import { Theme } from '@prisma/client'
import { create } from 'zustand'

interface UserState {
    id: string
    name: string
    theme: Theme
}

interface UserActions {
    initialize: () => Promise<void>
    updateTheme: (theme: Theme) => void
}

const initialState: UserState = {
    id: '',
    name: '',
    theme: 'SYSTEM'
}

interface UserStore extends UserState, UserActions {}

export const useUserStore = create<UserStore>()((set, get) => ({
    ...initialState,

    initialize: async () => {
        const response = await window.api.user.getCurrentUser()
        if (response.success) {
            set({ ...response.data.user })
        }
        console.log('User store initialized', response)
    },

    updateTheme: async (theme: Theme) => {
        const { id } = get()
        window.api.user.updateTheme({ userId: id, theme })
        set({ theme })
    }
}))
