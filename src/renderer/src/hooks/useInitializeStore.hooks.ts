import { useCourseFolderStore, useCoursesStore } from '../store'
import { useCallback, useEffect, useState } from 'react'

export const useInitializeStore = () => {
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeCourseStore = useCoursesStore((state) => state.initialize)
    const initializeCourseFolderStore = useCourseFolderStore((state) => state.initialize)

    const initializeStores = useCallback(async () => {
        await Promise.all([initializeCourseStore(), initializeCourseFolderStore()])
        setIsInitialized(true)
    }, [initializeCourseStore, initializeCourseFolderStore])

    useEffect(() => {
        initializeStores()
    }, [initializeStores])

    return isInitialized
}
