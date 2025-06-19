import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const courses = sqliteTable(
    'courses',
    {
        id: text().notNull(),
        name: text().notNull(),
        description: text().notNull(),
        folderName: text('folder_name').notNull(),
        buildAt: text('build_at').notNull()
    },
    (table) => [
        uniqueIndex('courses_folder_name_key').on(table.folderName),
        uniqueIndex('courses_name_key').on(table.name),
        uniqueIndex('courses_id_key').on(table.id)
    ]
)
