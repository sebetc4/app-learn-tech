import { useCourseFolderStore } from './course-folder.store'
import { toast } from 'sonner'
import { create } from 'zustand'

import { CoursePreview } from '@/types'

interface CoursesState {
    courses: CoursePreview[]
    isLoading: boolean
}

interface CoursesAction {
    initialize: () => Promise<void>
    addCourse: (courseDirName: string) => Promise<void>
    updateCourse: (courseDirName: string) => Promise<void>
    removeCourse: (courseId: string) => Promise<void>
}

interface CoursesStore extends CoursesState, CoursesAction {}

const initialState: CoursesState = {
    courses: [],
    isLoading: false
}

export const useCoursesStore = create<CoursesStore>()((set) => ({
    ...initialState,

    initialize: async () => {
        set({ isLoading: true })
        try {
            const response = await window.api.course.getAll()
            if (response.success) {
                set({
                    courses: response.data.courses.sort((a, b) => a.name.localeCompare(b.name))
                })
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Error during courses initialization')
        } finally {
            set({ isLoading: false })
        }
    },

    addCourse: async (courseDirName: string) => {
        const response = await window.api.course.addOne({ courseDirName })
        if (!response.success) {
            toast.error(response.message)
            return
        }
        const { course } = response.data
        set((state) => ({
            courses: [...state.courses, course].sort((a, b) => a.name.localeCompare(b.name))
        }))
        useCourseFolderStore.getState().delete(course.id)
    },

    updateCourse: async (courseDirName: string) => {
        const response = await window.api.course.uploadOne({ courseDirName })
        if (!response.success) {
            toast.error(response.message)
            return
        }
        const { course } = response.data
        set((state) => ({
            courses: state.courses.map((c) => (c.id === course.id ? course : c))
        }))
        useCourseFolderStore.getState().delete(course.id)
    },

    removeCourse: async (courseId: string) => {
        set((state) => ({
            courses: state.courses.filter((course) => course.id !== courseId)
        }))
    }
}))
