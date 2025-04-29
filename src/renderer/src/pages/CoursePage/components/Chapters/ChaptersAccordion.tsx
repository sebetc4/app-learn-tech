import styles from './ChaptersAccordion.module.scss'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { FC, forwardRef } from 'react'

import { CourseViewModel } from '@/types'

interface ChaptersAccordionProps {
    chapters: CourseViewModel['chapters']
}

export const ChaptersAccordion: FC<ChaptersAccordionProps> = ({ chapters }) => (
    <Accordion.Root
        className={styles.root}
        type="single"
        defaultValue="item-1"
        collapsible
    >
        {chapters.map((chapter) => (
            <ChapterItem
                key={chapter.id}
                chapter={chapter}
            />
        ))}
    </Accordion.Root>
)

interface ChapterItemProps {
    chapter: CourseViewModel['chapters'][0]
}

const ChapterItem: FC<ChapterItemProps> = ({ chapter }) => (
    <Accordion.Item
        key={chapter.id}
        className={styles.item}
        value={chapter.id}
    >
        <AccordionTrigger>{chapter.name}</AccordionTrigger>
        <AccordionContent>{chapter.name}</AccordionContent>
    </Accordion.Item>
)

interface AccordionTriggerProps extends React.ComponentPropsWithRef<typeof Accordion.Trigger> {
    children: React.ReactNode
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
    ({ children, ...props }, forwardedRef) => (
        <Accordion.Header className="AccordionHeader">
            <Accordion.Trigger
                className={'AccordionTrigger'}
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
            className={'AccordionContent'}
            {...props}
            ref={forwardedRef}
        >
            <div className="AccordionContentText">{children}</div>
        </Accordion.Content>
    )
)

AccordionContent.displayName = 'AccordionContent'
