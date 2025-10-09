// src/db.js
import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

const prisma = new PrismaClient({ adapter })

export default prisma
