import type { Prisma } from '@prisma/client';
import type { TenantContext } from '@/modules/company/context';
import type { Command } from '@/modules/workspace/contracts';
import { notFound } from '@/server/http/errors';
import { requireProject } from '@/modules/projects/repository';

export async function purchaseCommand(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'purchase'}>){
  const companyId=ctx.companyId,projectId=cmd.payload.projectId,id=cmd.payload.id;
  await requireProject(tx,ctx,projectId);
  const risk=await tx.aiRiskAlert.findUnique({where:{id_projectId_companyId:{id,projectId,companyId}}});
  if(!risk)notFound('Risk');
  // Row update serializes concurrent requests; unique riskId guarantees one request per recommendation.
  await tx.aiRiskAlert.update({where:{id_projectId_companyId:{id,projectId,companyId}},data:{isActioned:true}});
  const existing=await tx.purchaseRequest.findFirst({where:{riskId:id,companyId,projectId}});
  if(existing)return existing;
  return tx.purchaseRequest.create({data:{companyId,projectId,riskId:id,title:'Façade materials · Block A',status:'PENDING_APPROVAL'}});
}
