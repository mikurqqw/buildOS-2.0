import {requireProjectAccess} from '@/modules/company/access';
import type { Prisma } from '@prisma/client';
import { notFound } from '@/server/http/errors';
import type { TenantContext } from '@/modules/company/context';

export async function requireProject(tx: Prisma.TransactionClient, ctx: TenantContext, id: string) {
  await requireProjectAccess(tx,ctx,id);
  const project = await tx.project.findUnique({ where: { id_companyId: { id, companyId: ctx.companyId } } });
  if (!project) notFound('Project');
  return project;
}
