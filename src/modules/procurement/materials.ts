import type {Prisma} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import type {Command} from '@/modules/workspace/contracts';
import {requireProject} from '@/modules/projects/repository';
import {AppError,notFound} from '@/server/http/errors';
export async function materials(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'materialRequest'|'purchaseDecision'}>){
 const companyId=ctx.companyId,projectId=cmd.payload.projectId;await requireProject(tx,ctx,projectId);
 if(cmd.action==='materialRequest')return tx.purchaseRequest.create({data:{companyId,projectId,title:cmd.payload.title,decisionNote:cmd.payload.notes||null,requestedById:ctx.userId}});
 const p=cmd.payload;
 await tx.$queryRaw`SELECT "id" FROM "PurchaseRequest" WHERE "id"=${p.id} AND "companyId"=${companyId} FOR UPDATE`;
 const request=await tx.purchaseRequest.findFirst({where:{id:p.id,companyId,projectId}});if(!request)notFound('Purchase request');
 const transitions:Record<string,string[]>={PENDING_APPROVAL:['APPROVED','REJECTED'],APPROVED:['ORDERED'],ORDERED:['DELIVERED'],REJECTED:[],DELIVERED:[]};
 if(!transitions[request.status]?.includes(p.status))throw new AppError(409,'INVALID_TRANSITION','Invalid purchase status transition.');
 if(['APPROVED','REJECTED'].includes(p.status)&&!['DIRECTOR','PROJECT_MANAGER'].includes(ctx.role))throw new AppError(403,'FORBIDDEN','Manager approval required.');
 if(['ORDERED','DELIVERED'].includes(p.status)&&!['DIRECTOR','PROJECT_MANAGER','PROCUREMENT'].includes(ctx.role))throw new AppError(403,'FORBIDDEN','Procurement access required.');
 await tx.purchaseRequest.update({where:{id:request.id},data:{events:[...(Array.isArray(request.events)?request.events:[]),{status:p.status,at:new Date().toISOString(),actorId:ctx.userId||'',note:p.notes||''}],status:p.status,approvedBy:['APPROVED','REJECTED'].includes(p.status)?ctx.userId:request.approvedBy,approvedAt:['APPROVED','REJECTED'].includes(p.status)?new Date():request.approvedAt,decisionNote:p.notes||request.decisionNote}});
}
