import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

export const mediaContextBridge = {
    getVideoPath: (courseId: string, lessonId: string) =>
        ipcRenderer.invoke(IPC.MEDIA.VIDEO_PATH, courseId, lessonId),
    getCodeSnippetContent: (
        courseId: string,
        lessonId: string,
        snippetId: string,
        extension: string
    ) => ipcRenderer.invoke(IPC.MEDIA.CODE_SNIPPET, courseId, lessonId, snippetId, extension),
    checkDiskSpace: () => ipcRenderer.invoke(IPC.MEDIA.CHECK_DISK_SPACE),
    getCourseSize: (courseId: string) => ipcRenderer.invoke(IPC.MEDIA.COURSE_SIZE, courseId)
}
