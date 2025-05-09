import { CodeSnippet, CourseImage } from '@/renderer/src/components'
import * as babel from '@babel/standalone'
import React, { ComponentType, FC, useEffect, useState } from 'react'

interface TextSectionProps {
    jsxPath: string
}

interface CompiledComponentProps {
    CodeSnippet: ComponentType
    CourseImage: ComponentType
}

interface CompiledModuleExports {
    CourseContent?: ComponentType<CompiledComponentProps>
    default?: ComponentType<CompiledComponentProps>
}

export const TextSection: FC<TextSectionProps> = ({ jsxPath }) => {
    const [CompiledComponent, setCompiledComponent] =
        useState<ComponentType<CompiledComponentProps> | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const compileJsx = (jsx: string): ComponentType<CompiledComponentProps> => {
        try {
            if (!jsx || typeof jsx !== 'string') {
                throw new Error('JSX content is empty or invalid')
            }

            const transformedCode = babel.transform(jsx, {
                presets: ['react'],
                plugins: ['transform-modules-commonjs'],
                filename: 'dynamic-component.jsx'
            }).code

            if (!transformedCode) {
                throw new Error('JSX transformation failed')
            }

            const module: { exports: CompiledModuleExports } = { exports: {} }

            new Function('module', 'exports', 'require', 'React', transformedCode)(
                module,
                module.exports,
                (moduleName: string) => (moduleName === 'react' ? React : null),
                React
            )

            return module.exports.CourseContent as ComponentType<CompiledComponentProps>
        } catch (err) {
            console.error(
                'Import course jsx component error:',
                err instanceof Error ? err.stack : String(err)
            )
            throw err
        }
    }

    useEffect(() => {
        const loadCourseContent = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await window.api.lesson.getJSXContent({ jsxPath })

                if (response.success) {
                    const { jsxContent } = response.data
                    const Component = compileJsx(jsxContent)
                    setCompiledComponent(() => Component)
                } else {
                    throw new Error('Failed to get JSX content')
                }
            } catch (err) {
                console.error('Erreur lors du chargement du contenu:', err)
                setError(
                    typeof err === 'object' && err !== null && 'message' in err
                        ? String(err.message)
                        : 'Erreur inconnue'
                )
            } finally {
                setLoading(false)
            }
        }

        if (jsxPath) {
            loadCourseContent()
        }

        return () => {
            setCompiledComponent(null)
        }
    }, [jsxPath])

    if (loading) {
        return <div className="loading">Chargement du contenu du cours...</div>
    }

    if (error) {
        return <div className="error">Erreur: {error}</div>
    }

    if (!CompiledComponent) {
        return <div className="empty">Aucun contenu disponible</div>
    }

    return (
        <div className="course-content">
            <CompiledComponent
                CodeSnippet={CodeSnippet}
                CourseImage={CourseImage}
            />
        </div>
    )
}
