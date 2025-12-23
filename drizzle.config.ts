import type { Config } from 'drizzle-kit'

export default {
    schema: './src/database/schemas/index.ts',
    out: './src/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: './databases/dev.db'
    }
} satisfies Config
