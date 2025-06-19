import { chapters } from './chapter.schema'
import { courses } from './course.schema'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const lessonTypes = ['TEXT', 'VIDEO', 'TEXT_AND_VIDEO'] as const

export const lessons = sqliteTable('lessons', {
    id: text().primaryKey().notNull(),
    position: integer().notNull(),
    name: text().notNull(),
    type: text('type', { enum: lessonTypes }).notNull(),
    videoDuration: integer('video_duration'),
    chapterId: text('chapter_id')
        .notNull()
        .references(() => chapters.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    courseId: text('course_id')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
