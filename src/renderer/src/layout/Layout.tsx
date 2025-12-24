import { useInitializeStore } from '../hooks'
import { useCoursesStore } from '../store'
import { Header } from './components'
import { FC, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

import type { IntegrityCheckResult } from '@/types'

export const Layout: FC = () => {
    const isInitialized = useInitializeStore()
    const navigate = useNavigate()
    const handleIntegrityCheckResult = useCoursesStore((state) => state.handleIntegrityCheckResult)

    useEffect(() => {
        const handleIntegrityCheck = (result: IntegrityCheckResult) => {
            if (result.deactivated > 0) {
                toast.warning(`${result.deactivated} course(s) deactivated - missing folders`, {
                    duration: 5000,
                    action: {
                        label: 'View',
                        onClick: () => navigate('/course-manager')
                    }
                })
                handleIntegrityCheckResult(result)
            }
        }

        window.api.course.onIntegrityCheckComplete(handleIntegrityCheck)

        return () => {
            window.api.course.removeIntegrityCheckListener()
        }
    }, [navigate, handleIntegrityCheckResult])

    return isInitialized ? (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Toaster />
        </>
    ) : (
        <main>
            <div>Loading...</div>
        </main>
    )
}
