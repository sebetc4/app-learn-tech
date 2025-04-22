import type { ThemeValue } from '../theme.types'
import type { IPCHandlerReturnWithData, IPCHandlerReturnWithoutData } from './core-ipc.types'

export type GetThemeIPCHandlerReturn = Promise<IPCHandlerReturnWithData<{ theme: ThemeValue }>>

export type SetThemeIPCHandlerParams = {
    theme: ThemeValue
}
export type SetThemeIPCHandlerReturn = Promise<IPCHandlerReturnWithoutData>
export type ToggleThemeIPCHandlerReturn = Promise<IPCHandlerReturnWithoutData>
