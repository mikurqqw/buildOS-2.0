import { z } from 'zod';
import { AppError } from './http/errors';

const configSchema = z.object({
  DATABASE_URL: z.string().url().refine(v => /^postgres(?:ql)?:\/\//.test(v), 'Expected PostgreSQL URL'),
  DEMO_MODE: z.enum(['true', 'false']).default('false'),
  DEMO_COMPANY_ID: z.string().uuid().default('10000000-0000-4000-8000-000000000001'),
});

// Lazy validation lets Next.js build without a live database or secrets.
export function config() {
  const result = configSchema.safeParse(process.env);
  if (!result.success) throw new AppError(503, 'CONFIGURATION_ERROR', 'Database configuration is missing or invalid. Follow docs/SETUP_RU.md.');
  return result.data;
}
