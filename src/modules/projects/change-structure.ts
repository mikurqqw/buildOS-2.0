import type {Prisma} from '@prisma/client';
import type {TenantContext} from '@/modules/company/context';
import type {Command} from '@/modules/workspace/contracts';
import {requireProject} from './repository';
import {AppError,notFound} from '@/server/http/errors';
export async function changeStructure(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'changeStructure'}>){
 const p=cmd.payload,where={id:p.id,projectId:p.projectId,companyId:ctx.companyId};await requireProject(tx,ctx,p.projectId);
 if(p.operation==='rename'){
  if(p.entity==='floor'&&!/^-?\d{1,3}$/.test(p.value))throw new AppError(422,'INVALID_LEVEL','Enter an integer floor level.');
  await tx.$queryRaw`SELECT "id" FROM "Project" WHERE "id"=${p.projectId} AND "companyId"=${ctx.companyId} FOR UPDATE`;
  const current=p.entity==='floor'?await tx.floor.findFirst({where}):p.entity==='zone'?await tx.zone.findFirst({where}):null;
  const duplicate=p.entity==='building'?await tx.building.findFirst({where:{projectId:p.projectId,companyId:ctx.companyId,name:p.value,id:{not:p.id}}}):p.entity==='floor'&&current&&'buildingId' in current?await tx.floor.findFirst({where:{buildingId:current.buildingId,level:Number(p.value),id:{not:p.id}}}):p.entity==='zone'&&current&&'floorId' in current?await tx.zone.findFirst({where:{floorId:current.floorId,name:p.value,id:{not:p.id}}}):null;
  if(duplicate)throw new AppError(409,'DUPLICATE_STRUCTURE','This structure item already exists.');
  const result=p.entity==='building'?await tx.building.updateMany({where,data:{name:p.value}}):p.entity==='floor'?await tx.floor.updateMany({where,data:{level:Number(p.value)}}):await tx.zone.updateMany({where,data:{name:p.value}});
  if(!result.count)notFound('Structure item');return;
 }
 // Referential constraints deliberately prevent removing floors with issues or non-empty parents.
 const result=p.entity==='building'?await tx.building.deleteMany({where}):p.entity==='floor'?await tx.floor.deleteMany({where}):await tx.zone.deleteMany({where});
 if(!result.count)notFound('Structure item');
}
