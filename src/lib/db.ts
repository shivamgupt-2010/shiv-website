import { PrismaClient } from '@prisma/client'

const SUPABASE_DB_URL = "postgresql://postgres.onshnlrygyumoyhfonfb:13feb20tenshiv@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || SUPABASE_DB_URL,
      },
    },
  });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db
