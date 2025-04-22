import { JSX } from 'react'
import { Header } from './layout'
import { Outlet } from 'react-router-dom'

function App(): JSX.Element {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default App
