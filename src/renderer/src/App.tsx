import { Header } from './layout'
import { JSX } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

function App(): JSX.Element {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Toaster />
        </>
    )
}

export default App
