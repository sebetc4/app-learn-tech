import { CoursesFolder } from '@prisma/client'
import { create } from 'zustand'

interface CoursesFolderState {
    folders: CoursesFolder[]
}

interface CoursesFolderActions {
    addFolder: (path) => void
    removeFolder: (folderId: string) => void
}

interface CoursesFolderStore extends CoursesFolderState, CoursesFolderActions {}

const initState: CoursesFolderState = {
    folders: []
}

export const useCoursesFolderStore = create<CoursesFolderStore>()((set) => ({
    ...initState,
    addFolder: () => {
        window.api.course
        set((state) => ({
            folders: [...state.folders, '']
        })),
    }
    removeFolder: (folderId) => {
        set((state) => ({
            folders: state.folders.filter((folder) => folder.id !== folderId)
        }))
    }
}))
