export type IPCHandlerReturn<T> = {
    success: boolean;
    message: string;
    data: T;
}