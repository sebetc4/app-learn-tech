import { MDXComponent } from '@/renderer/src/components'
import { protocolService } from '@/renderer/src/services'
import { FC } from 'react'

interface TextSectionProps {
    mdxPath: string
}

const customComponents = {
    h1: (props) => (
        <h1
            style={{ color: 'blue' }}
            {...props}
        />
    ),
    Button: (props) => (
        <button
            {...props}
            className="my-button"
        />
    )
}

export const TextSection: FC<TextSectionProps> = ({ mdxPath }) => {
    return (
        <MDXComponent
            filePath={protocolService.course.getFilePath(mdxPath)}
            components={customComponents}
        />
    )
}
