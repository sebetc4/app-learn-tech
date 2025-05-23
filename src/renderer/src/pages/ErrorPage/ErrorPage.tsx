import { PAGE_PATH } from '../../constants'
import { FC } from 'react'
import { Link, useRouteError } from 'react-router-dom'

export const ErrorPage: FC = () => {
    const error = useRouteError()
    console.error(error)

    const message = error instanceof Error ? error.message : 'Unknown error'

    return (
        <>
            <Link to={PAGE_PATH.HOME}>Back to home</Link>
            <h1>Error</h1>
            <p>{message}</p>
        </>
    )
}
