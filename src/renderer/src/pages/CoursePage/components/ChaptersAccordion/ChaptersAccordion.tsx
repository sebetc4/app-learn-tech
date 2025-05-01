import styles from './ChaptersAccordion.module.scss'
import { LessonsList } from './components'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { FC, forwardRef } from 'react'

import { CourseViewModel } from '@/types'

interface ChaptersAccordionProps {
    courseId: string
    chapters: CourseViewModel['chapters']
}

export const ChaptersAccordion: FC<ChaptersAccordionProps> = ({ chapters, courseId }) => {
    const sortedChapters = [...chapters].sort((a, b) => a.position - b.position)
    return (
        <Accordion.Root
            className={styles.root}
            type="single"
            defaultValue={chapters[0].id}
            collapsible
        >
            {sortedChapters.map((chapter) => (
                <ChapterItem
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

const ChapterItem: FC<ChapterItemProps> = ({ courseId, chapter }) => (
    <Accordion.Item
        key={chapter.id}
        className={styles.item}
        value={chapter.id}
    >
        <AccordionTrigger>{`${chapter.position}. ${chapter.name}`}</AccordionTrigger>
        <AccordionContent>
            <LessonsList
                courseId={courseId}
                chapterId={chapter.id}
                lessons={chapter.lessons}
            />
        </AccordionContent>
    </Accordion.Item>
)

interface AccordionTriggerProps extends React.ComponentPropsWithRef<typeof Accordion.Trigger> {
    children: React.ReactNode
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ children, ...props }, forwardedRef) => (
        <Accordion.Header className={styles.header}>
            <Accordion.Trigger
                className={styles.trigger}
                {...props}
                ref={forwardedRef}
            >
                {children}
                <ChevronDown
                    className={styles.chevron}
                    aria-hidden
                />
            </Accordion.Trigger>
        </Accordion.Header>
    )
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
