import styles from './CodeSnippet.module.scss'
import { useLessonStore } from '@/renderer/src/store/lesson.store'
import { Check, Clipboard } from 'lucide-react'
import { type FC, useCallback, useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeSnippetProps {
    fileName: string
    language: string
}

export const CodeSnippet: FC<CodeSnippetProps> = ({ fileName, language }) => {
    const courseId = useLessonStore((state) => state.course?.id)
    const chapterId = useLessonStore((state) => state.chapter?.id)
    const lessonId = useLessonStore((state) => state.lesson?.id)
    const [content, setContent] = useState<string>('')
    const [copied, setCopied] = useState<boolean>(false)

    const fetchCodeSnippetContent = useCallback(async () => {
        if (!courseId || !chapterId || !lessonId) {
            setContent('Invalid course, chapter, or lesson ID')
            return
        }
        const response = await window.api.lesson.getCodeSnippetContent({
            courseId,
            chapterId,
            lessonId,
            fileName
        })
        if (response.success) {
            setContent(response.data.content)
        } else {
            setContent('Error fetching code snippet content')
        }
    }, [courseId, chapterId, lessonId, fileName])

    useEffect(() => {
        fetchCodeSnippetContent()
    }, [fetchCodeSnippetContent])

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={styles.container}>
            <button
                className={styles['copy-button']}
                onClick={handleCopy}
                aria-label="Copier le code"
            >
                Copier {copied ? <Check size={16} /> : <Clipboard size={16} />}
            </button>
            <SyntaxHighlighter
                language={language}
                style={tomorrow}
                className={styles['code-snippet']}
            >
                {content}
            </SyntaxHighlighter>
        </div>
    )
}
