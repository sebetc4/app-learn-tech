import { courses } from './course.schema'
import { users } from './user.schema'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const courseProgress = sqliteTable('course_progress', {
    id: text().primaryKey().notNull(),
    totalCourse: integer('total_course').notNull(),
    completedCourse: integer('completed_course').notNull(),
    percentage: integer().notNull(),
    courseId: text('course_id')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
