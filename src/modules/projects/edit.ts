import type {Prisma} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import type {Command} from '@/modules/workspace/contracts';
import {requireProject} from './repository';
import {AppError} from '@/server/http/errors';
export async function editProject(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'createProject'|'editProject'}>){
 const p=cmd.payload,companyId=ctx.companyId;
 if(p.endDate<p.startDate)throw new AppError(422,'INVALID_DATES','End date must not precede start date.');
 const data={name:p.name,budget:p.budget,startDate:new Date(p.startDate+'T00:00:00Z'),endDate:new Date(p.endDate+'T00:00:00Z'),status:p.status};
 if(cmd.action==='editProject'){await requireProject(tx,ctx,cmd.payload.projectId);return tx.project.update({where:{id_companyId:{id:cmd.payload.projectId,companyId}},data});}
 const project=await tx.project.create({data:{companyId,...data}});
 if(ctx.userId)await tx.projectMember.create({data:{companyId,projectId:project.id,userId:ctx.userId}});
 return project;
}
