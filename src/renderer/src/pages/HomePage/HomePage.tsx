import { useUserStore } from '@renderer/store'
import { FC } from 'react'

export const HomePage: FC = () => {
    const userName = useUserStore((state) => state.current.name)
    return (
        <>
            <div>Hello {userName}</div>
        </>
    )
}
