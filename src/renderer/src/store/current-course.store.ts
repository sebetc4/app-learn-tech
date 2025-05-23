import { create } from 'zustand'

import { CourseViewModel } from '@/types'

interface CurrentCourseState {
    course: CourseViewModel | null
}

interface CurrentCourseAction {
    fetchCourse: (courseId: string, userId: string) => Promise<void>
}

interface CurrentCourseStore extends CurrentCourseState, CurrentCourseAction {}

const initialState: CurrentCourseState = {
    course: null
}

export const useCurrentCourseStore = create<CurrentCourseStore>()((set) => ({
    ...initialState,

    async fetchCourse(courseId: string, userId: string) {
        const response = await window.api.course.getOne({ courseId, userId })
        if (response.success) {
            set({ course: response.data.course })
        } else {
            console.error(`Error fetching course: ${response.message}`)
        }
    }
}))
