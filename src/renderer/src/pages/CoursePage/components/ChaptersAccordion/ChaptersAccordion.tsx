import styles from './ChaptersAccordion.module.scss'
import { LessonsList } from './components'
import * as Accordion from '@radix-ui/react-accordion'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { FC, forwardRef, useEffect, useRef } from 'react'

import { CourseViewModel } from '@/types'

interface ChaptersAccordionProps {
    courseId: string
    chapters: CourseViewModel['chapters']
    currentChapterId: string | null
}

export const ChaptersAccordion: FC<ChaptersAccordionProps> = ({
    chapters,
    courseId,
    currentChapterId
}) => {
    const currentChapterRef = useRef<HTMLDivElement>(null)
    const sortedChapters = [...chapters].sort((a, b) => a.position - b.position)

    useEffect(() => {
        if (currentChapterRef.current) {
            currentChapterRef.current.scrollIntoView({
                block: 'start'
            })
        }
    }, [currentChapterId])

    const getDefaultValue = () => {
        if (currentChapterId) {
            return currentChapterId
        }
        for (const chapter of sortedChapters) {
            for (const lesson of chapter.lessons) {
                if (lesson.lessonProgress[0]?.status !== 'COMPLETED') {
                    return chapter.id
                }
            }
        }
        return undefined
    }

    return (
        <Accordion.Root
            className={styles.root}
            type="single"
            defaultValue={getDefaultValue()}
            collapsible
        >
            {sortedChapters.map((chapter) => (
                <ChapterItem
                    ref={chapter.id === currentChapterId ? currentChapterRef : null}
                    key={chapter.id}
                    courseId={courseId}
                    chapter={chapter}
                />
            ))}
        </Accordion.Root>
    )
}

interface ChapterItemProps {
    courseId: string
    chapter: CourseViewModel['chapters'][0]
}

const ChapterItem = forwardRef<HTMLDivElement, ChapterItemProps>(({ courseId, chapter }, ref) => (
    <Accordion.Item
        ref={ref}
        key={chapter.id}
        className={styles.item}
        value={chapter.id}
    >
        <AccordionTrigger chapter={chapter} />
        <AccordionContent>
            <LessonsList
                courseId={courseId}
                chapterId={chapter.id}
                lessons={chapter.lessons}
            />
        </AccordionContent>
    </Accordion.Item>
))

ChapterItem.displayName = 'ChapterItem'

interface AccordionTriggerProps extends React.ComponentPropsWithRef<typeof Accordion.Trigger> {
    chapter: CourseViewModel['chapters'][0]
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ chapter, ...props }, forwardedRef) => {
        const competedChaptersCount = chapter.lessons.filter(
            (lesson) => lesson.lessonProgress[0]?.status === 'COMPLETED'
        ).length
        const totalLessonsCount = chapter.lessons.length
        const allLessonsCompleted = competedChaptersCount === totalLessonsCount

        return (
            <Accordion.Header className={styles.header}>
                <Accordion.Trigger
                    className={styles.trigger}
                    {...props}
                    ref={forwardedRef}
                >
                    <span className={styles.title}>
                        <span>{`${chapter.position}.`}</span>
                        <span className={styles['title__text']}>
                            {chapter.name}
                            <span
                                className={clsx(
                                    styles['title__progress'],
                                    allLessonsCompleted && styles['title__progress--completed']
                                )}
                            >
                                {competedChaptersCount}/{totalLessonsCount}
                            </span>
                        </span>
                    </span>
                    <ChevronDown
                        className={styles.chevron}
                        aria-hidden
                    />
                </Accordion.Trigger>
            </Accordion.Header>
        )
    }
)

AccordionTrigger.displayName = 'AccordionTrigger'

interface AccordionContentProps extends React.ComponentPropsWithRef<typeof Accordion.Content> {
    children: React.ReactNode
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
    ({ children, ...props }, forwardedRef) => (
        <Accordion.Content
            className={styles.content}
            {...props}
            ref={forwardedRef}
        >
            {children}
        </Accordion.Content>
    )
)

AccordionContent.displayName = 'AccordionContent'
