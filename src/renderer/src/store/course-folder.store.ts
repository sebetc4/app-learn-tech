import { useCoursesStore } from './courses.store'
import { toast } from 'sonner'
import { create } from 'zustand'

import { ScannedCourse } from '@/types'

interface CourseFolderState {
    rootFolder: string | null
    scannedCourses: ScannedCourse[]
    rootFolderScanLoading: boolean
    isLoading: boolean
    importProgress: number
}

interface CourseFolderActions {
    initialize: () => void
    handleSelectRootFolder: () => Promise<void>
    scan: () => Promise<void>
    importArchive: () => Promise<void>
    delete: (courseId: string) => void
    setIsLoading: (loading: boolean) => void
    setImportProgress: (progress: number) => void
}

const initialState: CourseFolderState = {
    rootFolder: null,
    scannedCourses: [],
    rootFolderScanLoading: false,
    isLoading: false,
    importProgress: 0
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
            toast.error('Error during root folder initialization')
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
            toast.error('Error during root folder selection')
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
            toast.error('Error during course analysis')
        } finally {
            set({ isLoading: false, rootFolderScanLoading: false })
        }
    },

    importArchive: async () => {
        set({ isLoading: true, importProgress: 0 })

        let toastId: string | number | undefined

        // Listen for import start event (after file selection)
        window.api.folder.onImportArchiveStart(() => {
            // Show loading toast only when extraction actually starts
            toastId = toast.loading('Importing archive...', {
                description: 'Extracting files: 0%'
            })
        })

        // Listen for real-time progress updates from main process
        window.api.folder.onImportArchiveProgress((progress: number) => {
            set({ importProgress: progress })
            if (toastId) {
                toast.loading('Importing archive...', {
                    id: toastId,
                    description: `Extracting files: ${progress}%`
                })
            }
        })

        try {
            const response = await window.api.folder.importArchive()

            if (response.success) {
                const { course } = response.data
                useCoursesStore.getState().addCourseFromPreview(course)
                set({ importProgress: 100 })
                if (toastId) {
                    toast.success(response.message, { id: toastId })
                } else {
                    toast.success(response.message)
                }
            } else {
                if (toastId) {
                    toast.error(response.message, { id: toastId })
                } else {
                    toast.error(response.message)
                }
            }
        } catch (error) {
            console.error(error)
            if (toastId) {
                toast.error('Error during archive import', { id: toastId })
            } else {
                toast.error('Error during archive import')
            }
        } finally {
            // Clean up listener
            window.api.folder.removeImportArchiveProgressListener()
            set({ isLoading: false, importProgress: 0 })
        }
    },

    delete: (courseId: string) => {
        set((state) => ({
            scannedCourses: state.scannedCourses.filter(({ metadata }) => metadata.id !== courseId)
        }))
    },

    setIsLoading: (isLoading: boolean) => {
        set({ isLoading })
    },

    setImportProgress: (importProgress: number) => {
        set({ importProgress })
    }
}))
