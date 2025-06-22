// scripts/sync-databases.ts
import * as relations from '../src/database/relations'
import * as schema from '../src/database/schemas'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import fs from 'fs'
import path from 'path'

const projectRoot = process.cwd()

const PATHS = {
    migrations: path.join(projectRoot, 'src', 'database', 'migrations'),
    devDb: path.join(projectRoot, 'src', 'database', 'dev.db'),
    templateDb: path.join(projectRoot, 'resources', 'database', 'template.db'),
    schemasDir: path.join(projectRoot, 'src', 'database', 'schemas'),
    projectRoot
}

interface DatabaseConfig {
    path: string
    name: string
    required: boolean
}

async function syncDatabases() {
    const databases: DatabaseConfig[] = [
        {
            path: path.resolve(PATHS.devDb),
            name: 'Development',
            required: true
        },
        {
            path: path.resolve(PATHS.templateDb),
            name: 'Template',
            required: false
        }
    ]

    console.log('🚀 Starting database synchronization...\n')
    console.log(`📁 Project root: ${PATHS.projectRoot}`)
    console.log(`📁 Migrations folder: ${path.resolve(PATHS.migrations)}\n`)

    for (const { path: dbPath, name, required } of databases) {
        try {
            console.log(`📁 Updating ${name} database: ${dbPath}`)

            const dbDir = path.dirname(dbPath)
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true })
                console.log(`   📂 Created directory: ${dbDir}`)
            }

            const sqlite = new Database(dbPath)

            sqlite.pragma('journal_mode = WAL')
            sqlite.pragma('synchronous = NORMAL')

            const db = drizzle(sqlite, { schema: { ...schema, ...relations } })

            console.log(`   🔄 Applying migrations from: ${path.resolve(PATHS.migrations)}`)
            migrate(db, { migrationsFolder: PATHS.migrations })

            sqlite.close()

            console.log(`   ✅ ${name} database updated successfully\n`)
        } catch (error) {
            console.error(`   ❌ Failed to update ${name} database:`, error)

            if (required) {
                process.exit(1)
            } else {
                console.log(`   ⚠️  Skipping optional ${name} database\n`)
            }
        }
    }

    console.log('🎉 Database synchronization completed!')
}

syncDatabases().catch((error) => {
    console.error('💥 Database synchronization failed:', error)
    process.exit(1)
})
