import { useCourseFolderStore, useCoursesStore } from '../store'
import { useUserStore } from '../store/user.store'
import { useCallback, useEffect, useState } from 'react'

export const useInitializeStore = () => {
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeCourseStore = useCoursesStore((state) => state.initialize)
    const initializeCourseFolderStore = useCourseFolderStore((state) => state.initialize)
    const inititalizeUserStore = useUserStore((state) => state.initialize)

    const initializeStores = useCallback(async () => {
        await Promise.all([
            initializeCourseStore(),
            initializeCourseFolderStore(),
            inititalizeUserStore()
        ])
        setIsInitialized(true)
    }, [initializeCourseStore, initializeCourseFolderStore, inititalizeUserStore])

    useEffect(() => {
        initializeStores()
    }, [initializeStores])

    return isInitialized
}
