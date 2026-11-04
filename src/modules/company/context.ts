import type { Role } from '@/lib/domain';
import { can } from '@/lib/domain';
import { config } from '@/server/config';
import { AppError } from '@/server/http/errors';

export type TenantContext = { companyId: string; userId?:string; role: Role };
// Stage 1: explicit server-configured demo tenant. Stage 2 replaces this adapter with verified sessions.
export function demoContext(role: Role): TenantContext {
  const settings = config();
  if (settings.DEMO_MODE !== 'true') throw new AppError(401, 'AUTH_REQUIRED', 'Demo access is disabled. Authentication will be implemented in stage 2.');
  return { companyId: settings.DEMO_COMPANY_ID, role };
}
export function requirePermission(ctx: TenantContext, permission: string) {
  if (!can(ctx.role, permission)) throw new AppError(403, 'FORBIDDEN', 'Your role cannot perform this action');
}
