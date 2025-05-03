import { compile, runSync } from '@mdx-js/mdx'
import { MDXProvider } from '@mdx-js/react'
import { ComponentType, FC, useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime'

type MDXComponents = {
    [key: string]: ComponentType
}

interface MDXComponentProps {
    filePath: string
    components?: MDXComponents
}

export const MDXComponent: FC<MDXComponentProps> = ({ filePath, components = {} }) => {
    const [Content, setContent] = useState<ComponentType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const loadMDX = async () => {
            try {
                const response = await fetch(filePath)

                if (!response.ok) {
                    throw new Error(`Failed to fetch MDX file: ${response.statusText}`)
                }

                const text = await response.text()

                const code = String(await compile(text, { outputFormat: 'function-body' }))
                const { default: MDXComponent } = runSync(code, runtime)

                setContent(() => MDXComponent)
                setLoading(false)
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)))
                setLoading(false)
            }
        }

        loadMDX()
    }, [filePath])

    if (loading) return <div>Chargement...</div>
    if (error) return <div>Erreur: {error.message}</div>
    if (!Content) return null

    return (
        <MDXProvider components={components}>
            <Content />
        </MDXProvider>
    )
}
