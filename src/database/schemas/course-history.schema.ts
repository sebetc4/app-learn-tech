import { courses } from './course.schema'
import { users } from './user.schema'
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const courseHistory = sqliteTable(
    'course_history',
    {
        id: text().primaryKey().notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        courseId: text('course_id')
            .notNull()
            .references(() => courses.id, { onDelete: 'cascade' }),
        accessedAt: integer('accessed_at', { mode: 'timestamp' })
            .notNull()
            .default(sql`(strftime('%s', 'now'))`)
    },
    (table) => [
        uniqueIndex('course_history_user_course_idx').on(table.userId, table.courseId),
        index('course_history_user_accessed_idx').on(table.userId, table.accessedAt)
    ]
)
