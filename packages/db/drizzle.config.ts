import { configDotenv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

configDotenv()

export default defineConfig({
  schema: './schema/index.ts',
  out: './migrations',
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URI!,
  },
})
