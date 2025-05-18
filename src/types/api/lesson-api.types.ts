import type {
    GetCodeSnippetContentIPCHandlerParams,
    GetCodeSnippetContentIPCHandlerReturn,
    GetJSXLessonContentIPCHandlerParams,
    GetJSXLessonContentIPCHandlerReturn,
    GetLessonDataIPCHandlerParams,
    GetLessonDataIPCHandlerReturn
} from '../ipc'

export interface LessonAPI {
    getData: (params: GetLessonDataIPCHandlerParams) => GetLessonDataIPCHandlerReturn
    getJSXContent: (
        params: GetJSXLessonContentIPCHandlerParams
    ) => GetJSXLessonContentIPCHandlerReturn
    getCodeSnippetContent: (
        params: GetCodeSnippetContentIPCHandlerParams
    ) => GetCodeSnippetContentIPCHandlerReturn
}
