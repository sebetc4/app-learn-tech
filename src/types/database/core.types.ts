import * as relations from '@/database/relations'
import * as schema from '@/database/schemas'
import type { SQLJsDatabase } from 'drizzle-orm/sql-js'

export type DatabaseSchema = typeof schema & typeof relations
export type DrizzleDB = SQLJsDatabase<DatabaseSchema>

export type AutoSaveFunction = <T>(operation: () => Promise<T>) => Promise<T>
