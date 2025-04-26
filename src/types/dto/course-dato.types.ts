import { Course } from '@prisma/client'

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description' | 'buildAt'>

export type CoursePreviewData = CoursePreview[]
