import { toast } from 'sonner'
import { create } from 'zustand'

import { ScannedCourse } from '@/types'

interface CourseFolderState {
    rootFolder: string | null
    scannedCourses: ScannedCourse[]
    selectFolderIsLoading: boolean
    scanCoursesIsLoading: boolean
}

interface CourseFolderActions {
    initialize: () => void
    handleSelectRootFolder: () => void
    scan: () => Promise<void>
    delete: (courseId: string) => void
}

const initialState: CourseFolderState = {
    rootFolder: null,
    scannedCourses: [],
    selectFolderIsLoading: false,
    scanCoursesIsLoading: false
}

interface CourseFolderStore extends CourseFolderState, CourseFolderActions {}

export const useCourseFolderStore = create<CourseFolderStore>()((set) => ({
    ...initialState,

    initialize: async () => {
        try {
            const response = await window.api.folder.getRoot()
            if (response.success) {
                set({ rootFolder: response.data.path })
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de l'initialisation du dossier racine")
        }
    },

    handleSelectRootFolder: async () => {
        set({ selectFolderIsLoading: true })
        try {
            const response = await window.api.folder.setRoot()
            if (response.success) {
                set({ rootFolder: response.data.path })
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Erreur lors de la définition du dossier racine')
        } finally {
            set({ selectFolderIsLoading: false })
        }
    },

    scan: async () => {
        set({ scanCoursesIsLoading: true })
        try {
            const response = await window.api.folder.scan()
            if (response.success) {
                set({
                    scannedCourses: response.data.scannedCourses
                })
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de l'analyse des cours")
        } finally {
            set({ scanCoursesIsLoading: false })
        }
    },

    delete: (courseId: string) => {
        set((state) => ({
            scannedCourses: state.scannedCourses.filter(({ metadata }) => metadata.id !== courseId)
        }))
    }
}))
