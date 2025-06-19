import { lessons } from './lesson.schema'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const codeSnippets = sqliteTable('code_snippets', {
    id: text().primaryKey().notNull(),
    position: integer().notNull(),
    language: text().notNull(),
    extension: text().notNull(),
    lessonId: text('lesson_id')
        .notNull()
        .references(() => lessons.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})
