import styles from './TextSection.module.scss'
import * as babel from '@babel/standalone'
import { CodeSnippet, CourseImage } from '@renderer/components'
import { useLessonStore } from '@renderer/store'
import React, { ComponentType, FC, useCallback, useEffect, useState } from 'react'

interface CompiledComponentProps {
    CodeSnippet: typeof CodeSnippet
    CourseImage: typeof CourseImage
}

type CompiledComponent = ComponentType<CompiledComponentProps>

interface CompiledModuleExports {
    CourseContent?: ComponentType<CompiledComponentProps>
    default?: ComponentType<CompiledComponentProps>
}

export const TextSection: FC = () => {
    const courseId = useLessonStore((state) => state.course?.id)
    const chapterId = useLessonStore((state) => state.chapter?.id)
    const lessonId = useLessonStore((state) => state.lesson?.id)
    const [CompiledComponent, setCompiledComponent] = useState<CompiledComponent | null>(null)

    const loadCourseContent = useCallback(
        async (courseId: string, chapterId: string, lessonId: string) => {
            try {
                if (!courseId || !chapterId || !lessonId) {
                    throw new Error('Missing courseId, chapterId, or lessonId')
                }
                const response = await window.api.lesson.getJSXContent({
                    courseId,
                    chapterId,
                    lessonId
                })

                if (response.success) {
                    const { jsxContent } = response.data
                    const Component = compileJsx(jsxContent)
                    setCompiledComponent(() => Component)
                } else {
                    throw new Error('Failed to get JSX content')
                }
            } catch (err) {
                console.error('Erreur lors du chargement du contenu:', err)
            }
        },
        []
    )

    const compileJsx = (jsx: string): CompiledComponent => {
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
        if (courseId && chapterId && lessonId) {
            loadCourseContent(courseId, chapterId, lessonId)
        }

        return () => {
            setCompiledComponent(null)
        }
    }, [loadCourseContent, courseId, chapterId, lessonId])

    if (!courseId || !chapterId || !lessonId) {
        console.error('Navigation: Missing courseId, chapterId, or lessonId data')
        return null
    }

    return (
        <section className={styles.section}>
            {CompiledComponent && (
                <CompiledComponent
                    CodeSnippet={CodeSnippet}
                    CourseImage={CourseImage}
                />
            )}
        </section>
    )
}
