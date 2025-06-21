import { create } from 'zustand'

import { CreateUserDto, Theme, UpdateUserDto } from '@/types'
import { UserViewModel, UserViewModelWithoutTheme } from '@/types'

interface UserState {
    current: UserViewModel
    users: UserViewModelWithoutTheme[]
}

interface UserActions {
    initialize: () => Promise<void>
    addUser: (dto: CreateUserDto) => Promise<void>
    setCurrentUser: (userId: string) => Promise<void>
    update: (userId: string, dto: UpdateUserDto) => Promise<void>
    updateTheme: (theme: Theme) => void
    delete: (userId: string) => Promise<void>
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

    addUser: async (dto) => {
        console.log('store addUser called with:', dto)
        const response = await window.api.user.create(dto)
        if (response.success) {
            const user = response.data.user
            set((state) => ({
                users: [...state.users, user].sort((a, b) => a.name.localeCompare(b.name)),
                current: user
            }))
        } else {
            console.error('Failed to add user:', response.message)
        }
    },

    setCurrentUser: async (userId: string) => {
        const response = await window.api.user.setCurrentUser({ userId })
        if (response.success) {
            set({ current: response.data.user })
        } else {
            console.error('Failed to set current user:', response.message)
        }
    },

    update: async (userId, dto) => {
        const { current, users } = get()
        await window.api.user.update({
            userId,
            dto
        })
        const updatedCurrent = current.id === userId ? { ...current, ...dto } : current
        const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...dto } : user))
        set({
            current: updatedCurrent,
            users: updatedUsers.sort((a, b) => a.name.localeCompare(b.name))
        })
    },

    updateTheme: async (theme: Theme) => {
        const { current } = get()
        window.api.user.updateTheme({ userId: current.id, theme })
        set({ current: { ...current, theme } })
    },

    delete: async (userId: string) => {
        const { current, users, setCurrentUser } = get()

        const userToDeleteIndex = users.findIndex((user) => user.id === userId)
        if (userToDeleteIndex === -1) return

        const remainingUsers = users.filter((user) => user.id !== userId)
        if (current.id === userId) {
            await setCurrentUser(remainingUsers[0].id)
        }

        await window.api.user.delete({ userId })
        set({
            users: users.filter((user) => user.id !== userId)
        })
    }
}))
