import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// v2 - shared singleton
export default prisma;
