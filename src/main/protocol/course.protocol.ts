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

            const ext = path.extname(filePath).toLowerCase()

            if (isVideo(ext)) {
                return handleVideoRequest(filePath, request, ext)
            } else if (isJavaScript(ext)) {
                return handleJavaScriptRequest(filePath)
            } else {
                return handleOtherRequest(filePath, ext)
            }
        } catch (error) {
            console.error('Course protocol error:', error)
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

const nodeStreamToWeb = (nodeStream: fs.ReadStream): ReadableStream => {
    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', (chunk) => {
                controller.enqueue(chunk)
            })
            nodeStream.on('end', () => {
                controller.close()
            })
            nodeStream.on('error', (err) => {
                controller.error(err)
            })
        },
        cancel() {
            nodeStream.destroy()
        }
    })
}

const handleVideoRequest = (filePath: string, request: Request, ext: string) => {
    try {
        const stats = fs.statSync(filePath)
        const fileSize = stats.size

        const rangeHeader = request.headers.get('range')

        if (rangeHeader) {
            const parts = rangeHeader.replace(/bytes=/, '').split('-')
            const start = parseInt(parts[0], 10)
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
            const chunkSize = end - start + 1

            if (start >= fileSize || end >= fileSize) {
                return new Response('Range Not Satisfiable', {
                    status: 416,
                    headers: {
                        'Content-Range': `bytes */${fileSize}`,
                        'Accept-Ranges': 'bytes'
                    }
                })
            }

            const nodeStream = fs.createReadStream(filePath, { start, end })
            const webStream = nodeStreamToWeb(nodeStream)

            return new Response(webStream, {
                status: 206,
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': `${chunkSize}`,
                    'Content-Type': contentType(ext),
                    'Cache-Control': 'public, max-age=3600'
                }
            })
        } else {
            const nodeStream = fs.createReadStream(filePath)
            const webStream = nodeStreamToWeb(nodeStream)

            return new Response(webStream, {
                headers: {
                    'Content-Length': `${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Type': contentType(ext),
                    'Cache-Control': 'public, max-age=3600'
                }
            })
        }
    } catch (error) {
        console.error('Error handling video request:', error)
        return new Response(
            `Error reading video file: ${error instanceof Error ? error.message : String(error)}`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            }
        )
    }
}
const isVideo = (ext: string) => ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext)

const isJavaScript = (ext: string) => ['.js', '.jsx', '.mjs'].includes(ext)

const handleJavaScriptRequest = (filePath: string) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8')

        return new Response(content, {
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cache-Control': 'no-cache'
            }
        })
    } catch (error) {
        console.error('Error handling JavaScript file:', error)
        return new Response(
            `Error reading JavaScript file: ${error instanceof Error ? error.message : String(error)}`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            }
        )
    }
}

const contentType = (ext: string) => {
    switch (ext) {
        case '.mp4':
            return 'video/mp4'
        case '.webm':
            return 'video/webm'
        case '.mov':
            return 'video/quicktime'
        case '.avi':
            return 'video/x-msvideo'
        case '.mkv':
            return 'video/x-matroska'
        case '.js':
        case '.jsx':
        case '.mjs':
            return 'application/javascript; charset=utf-8'
        case '.css':
            return 'text/css; charset=utf-8'
        case '.html':
            return 'text/html; charset=utf-8'
        case '.json':
            return 'application/json; charset=utf-8'
        case '.png':
            return 'image/png'
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg'
        case '.svg':
            return 'image/svg+xml'
        case '.pdf':
            return 'application/pdf'
        default:
            return 'application/octet-stream'
    }
}

const handleOtherRequest = (filePath: string, ext: string) => {
    try {
        const content = fs.readFileSync(filePath)
        return new Response(content, {
            headers: {
                'Content-Type': contentType(ext),
                'Cache-Control': 'public, max-age=3600'
            }
        })
    } catch {
        return net.fetch(pathToFileURL(filePath).toString())
    }
}
