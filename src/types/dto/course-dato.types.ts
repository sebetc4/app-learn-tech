import { Course } from "@prisma/client";

export type CoursePreview = Pick<Course, 'id' | 'name' | 'description'>

export type CoursePreviewData = CoursePreview[]

