import type {Prisma} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import type {Command} from '@/modules/workspace/contracts';
import {requireProject} from './repository';
import {notFound} from '@/server/http/errors';
export async function structureCommand(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'building'|'floor'|'zone'}>){
 const companyId=ctx.companyId,projectId=cmd.payload.projectId;
 await requireProject(tx,ctx,projectId);
 if(cmd.action==='building')return tx.building.create({data:{companyId,projectId,name:cmd.payload.name}});
 if(cmd.action==='floor'){
  if(!await tx.building.findFirst({where:{id:cmd.payload.buildingId,projectId,companyId}}))notFound('Building');
  return tx.floor.create({data:{companyId,projectId,buildingId:cmd.payload.buildingId,level:Number(cmd.payload.level)}});
 }
 if(!await tx.floor.findFirst({where:{id:cmd.payload.floorId,projectId,companyId}}))notFound('Floor');
 return tx.zone.create({data:{companyId,projectId,floorId:cmd.payload.floorId,name:cmd.payload.name}});
}
