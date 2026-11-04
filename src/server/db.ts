import { PrismaClient } from '@prisma/client';
import { config } from './config';

const globalDb = globalThis as unknown as { buildosDb?: PrismaClient };
export function db(): PrismaClient {
  const settings = config();
  if (!globalDb.buildosDb) globalDb.buildosDb = new PrismaClient({
    datasources: { db: { url: settings.DATABASE_URL } },
    log: ['warn'],
  });
  return globalDb.buildosDb;
}
