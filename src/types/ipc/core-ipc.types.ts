export type IPCHandlerSuccessWithData<T> = {
    success: true
    message: string
    data: T
}

export type IPCHandlerSuccessWithoutData = {
    success: true
    message: string
}

export type IPCHandlerError = {
    success: false
    message: string
}

export type IPCHandlerReturnWithData<T> = IPCHandlerSuccessWithData<T> | IPCHandlerError
export type IPCHandlerReturnWithoutData = IPCHandlerSuccessWithoutData | IPCHandlerError