import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export function notFound(entity: string): never { throw new AppError(404, 'NOT_FOUND', `${entity} not found in this company.`); }
export async function endpoint(run: () => Promise<unknown>) {
  const requestId = crypto.randomUUID();
  const headers = { 'X-Request-Id': requestId, 'Cache-Control': 'no-store' };
  try { return NextResponse.json(await run(), { headers }); }
  catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: {
      code: 'VALIDATION_ERROR', message: 'Invalid request.',
      details: error.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
    }, requestId }, { status: 422, headers });
    if (error instanceof AppError) return NextResponse.json({ error: { code: error.code, message: error.message }, requestId }, { status: error.status, headers });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (['P2021','P2022'].includes(error.code)) return NextResponse.json({ error: { code: 'SCHEMA_NOT_READY', message: 'Apply database migrations before using the application.' }, requestId }, { status: 503, headers });
      if (['P2002', 'P2034'].includes(error.code)) return NextResponse.json({ error: { code: 'CONFLICT', message: 'Data changed concurrently. Reload and retry.' }, requestId }, { status: 409, headers });
      if (error.code === 'P2025') return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Record not found.' }, requestId }, { status: 404, headers });
      if (error.code === 'P2003') return NextResponse.json({ error: { code: 'INVALID_REFERENCE', message: 'Related record is not available in this company.' }, requestId }, { status: 422, headers });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) return NextResponse.json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'PostgreSQL is unavailable. Check the connection and migrations.' }, requestId }, { status: 503, headers });
    // Never return credentials, SQL, stack traces or submitted photo data.
    console.error('BuildOS request failed', { requestId, type: error instanceof Error ? error.name : 'Unknown' });
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' }, requestId }, { status: 500, headers });
  }
}
