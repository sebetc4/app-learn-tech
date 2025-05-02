import { FolderService } from '../services'
import { PROTOCOL } from '@/constants'
import { net, protocol } from 'electron'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

function nodeStreamToWeb(nodeStream: fs.ReadStream): ReadableStream {
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
        default:
            return 'application/octet-stream'
    }
}

const handleOtherRequest = (filePath: string) => {
    return net.fetch(pathToFileURL(filePath).toString())
}

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

            return isVideo(ext)
                ? handleVideoRequest(filePath, request, ext)
                : handleOtherRequest(filePath)
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
