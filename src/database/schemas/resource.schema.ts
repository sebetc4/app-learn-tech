import { lessons } from './lesson.schema'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const resourceTypes = ['GITHUB', 'STACKBLITZ'] as const

export const resources = sqliteTable('resources', {
    id: text().primaryKey().notNull(),
    type: text('type', { enum: resourceTypes }).notNull(),
    url: text().notNull(),
    lessonId: text('lesson_id')
        .notNull()
        .references(() => lessons.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
