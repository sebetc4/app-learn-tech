import { PROTOCOL, STORAGE_FOLDER } from '@/constants'
import { app, net, protocol } from 'electron'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export const registerIconProtocol = () => {
    protocol.handle(PROTOCOL.ICON, async (request) => {
        console.log(request)
        try {
            const iconRootPath = path.join(app.getPath('userData'), STORAGE_FOLDER.COURSE_ICON)
            if (!iconRootPath) {
                return new Response('Icons root path is not set', {
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

            const iconPath = path.join(iconRootPath, relativePath)

            if (!iconPath.startsWith(iconRootPath)) {
                return new Response('Access denied', {
                    status: 403,
                    headers: { 'Content-Type': 'text/plain' }
                })
            }

            if (!fs.existsSync(iconPath)) {
                return new Response(`Media not found: ${relativePath}`, {
                    status: 404,
                    headers: { 'Content-Type': 'text/plain' }
                })
            }

            return net.fetch(pathToFileURL(iconPath).toString())
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
