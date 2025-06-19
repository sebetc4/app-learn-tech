import * as relations from '@/database/relations'
import * as schema from '@/database/schemas'
import type { SQLJsDatabase } from 'drizzle-orm/sql-js'

export type DatabaseSchema = typeof schema & typeof relations
export type DrizzleDB = SQLJsDatabase<DatabaseSchema>

export type AutoSaveFunction = <T>(operation: () => Promise<T>) => Promise<T>

export type QueryWithRelationsFunction = <T>(queryFn: () => Promise<T>) => Promise<T>

export type JsonString = string
export type ParseableValue = string | object | null | undefined
export type ObjectWithStringifiedRelations = Record<string, ParseableValue>
