import type { Prisma } from '@prisma/client';
import type { TenantContext } from '@/modules/company/context';
import type { Command } from '@/modules/workspace/contracts';
import { AppError, notFound } from '@/server/http/errors';
import { tenderAnalysis, procurementRisk } from '@/modules/ai/mock';

export async function tenderCommand(tx: Prisma.TransactionClient, ctx: TenantContext, cmd: Extract<Command, {action:'newTender'|'analyze'|'convert'}>) {
  const companyId = ctx.companyId;
  if(cmd.action==='newTender') return tx.tender.create({data:{companyId,title:cmd.payload.title,clientName:cmd.payload.client,estimatedBudget:cmd.payload.budget,durationMonths:Number(cmd.payload.durationMonths),documentName:cmd.payload.document||null}});
  const where = {id_companyId:{id:cmd.payload.id,companyId}};
  const tender = await tx.tender.findUnique({where});
  if(!tender)notFound('Tender');
  if(cmd.action==='analyze') {
    if(tender.status==='WON')throw new AppError(409,'INVALID_TRANSITION','A won tender cannot be reanalyzed.');
    return tx.tender.update({where,data:{status:'ANALYSIS',aiTenderScore:tenderAnalysis.score,aiMarginPercent:tenderAnalysis.margin,aiRiskSummary:tenderAnalysis.risks}});
  }
  if(tender.aiTenderScore===null)throw new AppError(409,'INVALID_TRANSITION','Analyze tender first');
  // Lock this tender with an UPDATE before checking the project to serialize concurrent conversion.
  await tx.tender.update({where,data:{status:'WON'}});
  const existing = await tx.project.findUnique({where:{tenderId_companyId:{tenderId:tender.id,companyId}}});
  if(existing)return existing;
  const startDate=new Date(); const endDate=new Date(startDate);endDate.setUTCMonth(endDate.getUTCMonth()+tender.durationMonths);
  const dueDate=new Date(startDate);dueDate.setUTCDate(dueDate.getUTCDate()-1);
  const project=await tx.project.create({data:{companyId,tenderId:tender.id,name:tender.title,budget:tender.estimatedBudget,startDate,endDate}});
  return project;
}
