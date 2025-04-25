import { PAGE_PATH } from '../constants'

export type PagePathKey = keyof typeof PAGE_PATH
export type PagePathValue = (typeof PAGE_PATH)[PagePathKey]
