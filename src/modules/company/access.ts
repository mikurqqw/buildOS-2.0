import type {Prisma} from '@prisma/client';
import type {TenantContext} from './context';
import {AppError} from '@/server/http/errors';
export const financialAccess=(ctx:TenantContext)=>['DIRECTOR','ACCOUNTANT'].includes(ctx.role);
export const projectBudgetAccess=(ctx:TenantContext)=>['DIRECTOR','PROJECT_MANAGER','ACCOUNTANT'].includes(ctx.role);
export const tenderAccess=(ctx:TenantContext)=>['DIRECTOR','PROJECT_MANAGER','PTO'].includes(ctx.role);
export const allProjects=(ctx:TenantContext)=>['DIRECTOR','ACCOUNTANT'].includes(ctx.role);
export function projectFilter(ctx:TenantContext){
 return {companyId:ctx.companyId,...(allProjects(ctx)?{}:{members:{some:{userId:ctx.userId||'no-session-user'}}})};
}
export async function requireProjectAccess(tx:Prisma.TransactionClient,ctx:TenantContext,projectId:string){
 if(!await tx.project.findFirst({where:{id:projectId,...projectFilter(ctx)}}))throw new AppError(404,'NOT_FOUND','Project not found in this company.');
}
