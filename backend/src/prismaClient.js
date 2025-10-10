// src/db.js
import ws from 'ws'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config();

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString,
    ssl: process.env.NODE_ENV === "prduction" ? { rejectUnauthorized: false} : false
 })
const adapter = new PrismaNeon(pool)

const prisma = new PrismaClient({ adapter })

export default prisma
