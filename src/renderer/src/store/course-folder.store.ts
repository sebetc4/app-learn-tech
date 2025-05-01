import { toast } from 'sonner'
import { create } from 'zustand'

import { ScannedCourse } from '@/types'

interface CourseFolderState {
    rootFolder: string | null
    scannedCourses: ScannedCourse[]
    rootFolderScanLoading: boolean
    isLoading: boolean
}

interface CourseFolderActions {
    initialize: () => void
    handleSelectRootFolder: () => Promise<void>
    scan: () => Promise<void>
    delete: (courseId: string) => void
    setIsLoading: (loading: boolean) => void
}

const initialState: CourseFolderState = {
    rootFolder: null,
    scannedCourses: [],
    rootFolderScanLoading: false,
    isLoading: false
}

interface CourseFolderStore extends CourseFolderState, CourseFolderActions {}

export const useCourseFolderStore = create<CourseFolderStore>()((set, get) => ({
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
        set({ isLoading: true })
        try {
            const response = await window.api.folder.setRoot()
            if (response.success) {
                set({ rootFolder: response.data.path })
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
            await get().scan()
        } catch (error) {
            console.error(error)
            toast.error('Erreur lors de la définition du dossier racine')
        } finally {
            set({ isLoading: false })
        }
    },

    scan: async () => {
        set({ isLoading: true, rootFolderScanLoading: true })
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
            set({ isLoading: false, rootFolderScanLoading: false })
        }
    },

    delete: (courseId: string) => {
        set((state) => ({
            scannedCourses: state.scannedCourses.filter(({ metadata }) => metadata.id !== courseId)
        }))
    },

    setIsLoading: (isLoading: boolean) => {
        set({ isLoading })
    }
}))
