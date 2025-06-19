import { courses } from './course.schema'
import { lessons } from './lesson.schema'
import { users } from './user.schema'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const lessonProgressStatus = ['IN_PROGRESS', 'COMPLETED'] as const

export const lessonProgress = sqliteTable('lesson_progress', {
    id: text().primaryKey().notNull(),
    status: text('status', { enum: lessonProgressStatus }).default('IN_PROGRESS').notNull(),
    courseId: text('course_id')
        .notNull()
        .references(() => courses.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    lessonId: text('lesson_id')
        .notNull()
        .references(() => lessons.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
