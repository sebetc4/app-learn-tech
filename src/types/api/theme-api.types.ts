import type {
    GetThemeIPCHandlerReturn,
    SetThemeIPCHandlerParams,
    SetThemeIPCHandlerReturn,
    ToggleThemeIPCHandlerReturn
} from '../ipc'

export interface ThemeAPI {
    get: () => GetThemeIPCHandlerReturn
    set: (params: SetThemeIPCHandlerParams) => SetThemeIPCHandlerReturn
    toggle: () => ToggleThemeIPCHandlerReturn
}
