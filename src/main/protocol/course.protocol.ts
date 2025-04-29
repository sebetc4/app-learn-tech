import { FolderService } from '../services'
import { PROTOCOL } from '@/constants'
import { net, protocol } from 'electron'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export const registerCourseProtocol = (folderService: FolderService) => {
    protocol.handle(PROTOCOL.COURSE, async (request) => {
        try {
            const coursesRootPath = folderService.rootPath
            if (!coursesRootPath) {
                return new Response('Courses root path is not set', {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain' }
                })
            }

            const url = new URL(request.url)

            let relativePath = url.host

            let pathnamePart = decodeURIComponent(url.pathname)
            if (pathnamePart.startsWith('/')) {
                pathnamePart = pathnamePart.substring(1)
            }

            if (pathnamePart) {
                relativePath = path.join(relativePath, pathnamePart)
            }

            const filePath = path.join(coursesRootPath, relativePath)

            if (!filePath.startsWith(coursesRootPath)) {
                return new Response('Access denied', {
                    status: 403,
                    headers: { 'Content-Type': 'text/plain' }
                })
            }

            if (!fs.existsSync(filePath)) {
                return new Response(`Media not found: ${relativePath}`, {
                    status: 404,
                    headers: { 'Content-Type': 'text/plain' }
                })
            }

            return net.fetch(pathToFileURL(filePath).toString())
        } catch (error) {
            return new Response(
                `Internal Error: ${error instanceof Error ? error.message : String(error)}`,
                {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain' }
                }
            )
        }
    })
}
