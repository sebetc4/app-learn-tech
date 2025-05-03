import { compile } from '@mdx-js/mdx'
import fs from 'fs/promises'
import glob from 'glob'

export class MDXManager {
    async precompileMDX() {
        const mdxFiles = glob.sync('content/**/*.mdx')

        for (const filePath of mdxFiles) {
            console.log(`Compiling ${filePath}...`)
            const content = await fs.readFile(filePath, 'utf-8')

            const result = await compile(content, {
                outputFormat: 'function-body',
                development: process.env.NODE_ENV !== 'production'
            })

            const jsxContent = `import React from 'react';
                import {mdx} from '@mdx-js/react';
                import {useMDXComponents} from '@mdx-js/react';

                export function MDXContent({components, ...props}) {
                const combinedComponents = useMDXComponents(components);
                return ${result}
                }

                export default function MDXContentWrapper(props) {
                return React.createElement(MDXContent, {...props});
                }
            `

            const outputPath = filePath.replace('.mdx', '.jsx')
            await fs.writeFile(outputPath, jsxContent)
            console.log(`Created ${outputPath}`)
        }
    }
}
