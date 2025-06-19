import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const themes = ['LIGHT', 'DARK', 'SYSTEM'] as const

export const users = sqliteTable('users', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    theme: text('theme', { enum: themes }).default('SYSTEM').notNull()
})
