import { ChapterArchive } from "./chapter-archive.types"

export interface CourseArchive {
    id: string
    name: string
    description: string
    chapters: ChapterArchive[]
}
