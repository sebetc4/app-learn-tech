import type { ThemeValue } from '../theme.types'
import type { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

// Get theme
export type GetThemeIPCHandlerReturn = IPCHandlerReturnWithData<{ theme: ThemeValue }>

// Set theme
export type SetThemeIPCHandlerParams = {
    theme: ThemeValue
}
export type SetThemeIPCHandlerReturn = IPCHandlerReturnWithoutData

// Toggle theme
export type ToggleThemeIPCHandlerReturn = IPCHandlerReturnWithoutData
