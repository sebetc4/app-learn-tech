import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const settingKeys = ['COURSES_ROOT_FOLDER', 'CURRENT_USER'] as const

export const settings = sqliteTable('settings', {
    key: text('key', { enum: settingKeys }).primaryKey().notNull(),
    value: text().notNull()
})
