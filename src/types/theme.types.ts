import { THEME } from '@/constants'

export type ThemeKey = keyof typeof THEME
export type ThemeValue = (typeof THEME)[ThemeKey]
