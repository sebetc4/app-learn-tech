import { PAGE_PATH } from '@renderer/constants'

export type PagePathKey = keyof typeof PAGE_PATH
export type PagePathValue = (typeof PAGE_PATH)[PagePathKey]
