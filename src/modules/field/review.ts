import type {Prisma,IssueStatus} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import {AppError,notFound} from '@/server/http/errors';
const transitions:Record<IssueStatus,IssueStatus[]>={OPEN:['ASSIGNED','IN_PROGRESS'],ASSIGNED:['IN_PROGRESS'],IN_PROGRESS:['READY_FOR_REVIEW'],READY_FOR_REVIEW:['IN_PROGRESS','RESOLVED'],RESOLVED:['CLOSED','IN_PROGRESS'],CLOSED:['OPEN']};
export async function reviewIssue(tx:Prisma.TransactionClient,ctx:TenantContext,p:{id:string;projectId:string;status:IssueStatus;reviewNote?:string}){
 const where={id:p.id,projectId:p.projectId,companyId:ctx.companyId};
 await tx.$queryRaw`SELECT "id" FROM "Issue" WHERE "id"=${p.id} AND "companyId"=${ctx.companyId} FOR UPDATE`;
 const issue=await tx.issue.findFirst({where});if(!issue)notFound('Issue');
 if(!transitions[issue.status].includes(p.status))throw new AppError(409,'INVALID_TRANSITION','Invalid issue status transition.');
 const reviewing=issue.status==='READY_FOR_REVIEW'||p.status==='CLOSED'||issue.status==='CLOSED';
 if(reviewing&&!['DIRECTOR','PROJECT_MANAGER','PTO'].includes(ctx.role))throw new AppError(403,'REVIEW_REQUIRED','A manager or engineer must review this correction.');
 if(p.status==='RESOLVED'&&issue.reporterId&&issue.reporterId===ctx.userId)throw new AppError(403,'INDEPENDENT_REVIEW','Another employee must verify the correction.');
 await tx.issue.updateMany({where,data:{status:p.status}});
 await tx.issueHistory.create({data:{issueId:issue.id,companyId:ctx.companyId,projectId:p.projectId,actorId:ctx.userId||null,fromStatus:issue.status,toStatus:p.status,note:p.reviewNote||null}});
}
