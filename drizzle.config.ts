import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/website_portfolio',
  },
  verbose: true,
  strict: true,
})