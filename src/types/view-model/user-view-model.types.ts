import { Theme } from '@prisma/client'

export interface UserViewModel {
    id: string
    name: string
    theme: Theme
}
