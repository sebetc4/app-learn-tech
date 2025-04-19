import { FC } from 'react'
import { useRouteError } from 'react-router-dom'

export const ErrorPage: FC = () => {
    const error = useRouteError()
    console.error(error)

    const message = error instanceof Error ? error.message : 'Unknown error'

    return (
        <>
            <h1>Error</h1>
            <p>{message}</p>
        </>
    )
}
