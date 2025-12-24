import { useCourseFolderStore } from './course-folder.store'
import { toast } from 'sonner'
import { create } from 'zustand'

import { CoursePreview, IntegrityCheckResult } from '@/types'

interface CoursesState {
    courses: CoursePreview[]
    inactiveCourses: CoursePreview[]
    isLoading: boolean
}

interface CoursesAction {
    initialize: () => Promise<void>
    addCourse: (courseDirName: string) => Promise<void>
    addCourseFromPreview: (course: CoursePreview) => void
    updateCourse: (courseDirName: string) => Promise<void>
    removeCourse: (courseId: string) => Promise<void>
    fetchInactiveCourses: () => Promise<void>
    hardDeleteCourse: (courseId: string) => Promise<void>
    handleIntegrityCheckResult: (result: IntegrityCheckResult) => void
}

interface CoursesStore extends CoursesState, CoursesAction {}

const initialState: CoursesState = {
    courses: [],
    inactiveCourses: [],
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

    addCourseFromPreview: (course: CoursePreview) => {
        set((state) => ({
            courses: [...state.courses, course].sort((a, b) => a.name.localeCompare(b.name))
        }))
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
    },

    fetchInactiveCourses: async () => {
        try {
            const response = await window.api.course.getInactive()
            if (response.success) {
                set({
                    inactiveCourses: response.data.courses.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
                })
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error('Error fetching inactive courses:', error)
            toast.error('Error fetching inactive courses')
        }
    },

    hardDeleteCourse: async (courseId: string) => {
        try {
            const response = await window.api.course.hardDelete({ courseId })
            if (response.success) {
                set((state) => ({
                    courses: state.courses.filter((c) => c.id !== courseId),
                    inactiveCourses: state.inactiveCourses.filter((c) => c.id !== courseId)
                }))
                toast.success('Course permanently deleted')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error('Error deleting course:', error)
            toast.error('Error deleting course')
        }
    },

    handleIntegrityCheckResult: (result: IntegrityCheckResult) => {
        if (result.deactivated > 0) {
            set((state) => ({
                courses: state.courses.filter((c) => !result.deactivatedCourseIds.includes(c.id))
            }))
        }
    }
}))
