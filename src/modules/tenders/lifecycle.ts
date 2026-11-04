import type {Prisma,TenderStatus} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import type {Command} from '@/modules/workspace/contracts';
import {AppError,notFound} from '@/server/http/errors';
import {tenderTransitions} from './transitions';
export async function changeTender(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'editTender'|'tenderStatus'}>){
 const id=cmd.payload.id,companyId=ctx.companyId;
 await tx.$queryRaw`SELECT "id" FROM "Tender" WHERE "id"=${id} AND "companyId"=${companyId} FOR UPDATE`;
 const where={id_companyId:{id,companyId}},tender=await tx.tender.findUnique({where});if(!tender)notFound('Tender');
 if(cmd.action==='editTender'){
  if(tender.status==='WON')throw new AppError(409,'INVALID_TRANSITION','Won tender is locked.');
  return tx.tender.update({where,data:{title:cmd.payload.title,clientName:cmd.payload.client,estimatedBudget:cmd.payload.budget,durationMonths:Number(cmd.payload.durationMonths),aiTenderScore:null,aiMarginPercent:null,aiRiskSummary:PrismaJsonNull()}});
 }
 if(!(tenderTransitions[tender.status] as string[]).includes(cmd.payload.status))throw new AppError(409,'INVALID_TRANSITION','Invalid tender status transition.');
 return tx.tender.update({where,data:{status:cmd.payload.status}});
}
import {Prisma as PrismaRuntime} from '@prisma/client';
function PrismaJsonNull(){return PrismaRuntime.DbNull}
