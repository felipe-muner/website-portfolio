import { drizzle } from 'drizzle-orm/neon-serverless'
import { neonConfig, Pool } from '@neondatabase/serverless'
import * as schema from './schema'

// Configure for production (Vercel + Neon)
if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = WebSocket
  neonConfig.poolQueryViaFetch = true
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool, { schema })