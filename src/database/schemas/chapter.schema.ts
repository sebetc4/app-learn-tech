import { courses } from './course.schema'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const chapters = sqliteTable('chapters', {
    id: text().primaryKey().notNull(),
    position: integer().notNull(),
    name: text().notNull(),
    courseId: text('course_id')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
