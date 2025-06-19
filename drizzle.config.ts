import type { Config } from 'drizzle-kit'

export default {
    schema: './src/database/schema.ts',
    out: './migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './resources/database/sqlite.db'
    }
} satisfies Config
