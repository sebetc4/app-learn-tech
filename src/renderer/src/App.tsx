import { useInitializeStore } from './hooks/useInitializeStore.hooks'
import { Header } from './layout'
import { JSX } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function App(): JSX.Element {
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

export default App
