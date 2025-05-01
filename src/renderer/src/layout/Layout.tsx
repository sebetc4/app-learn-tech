import { useInitializeStore } from '../hooks'
import { Header } from './components'
import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

export const Layout: FC = () => {
    const isInitialized = useInitializeStore()

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
