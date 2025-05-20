import { useUserStore } from '../../store/user.store'
import { FC } from 'react'

export const HomePage: FC = () => {
    const userName = useUserStore((state) => state.name)
    return (
        <>
            <div>Hello {userName}</div>
        </>
    )
}
