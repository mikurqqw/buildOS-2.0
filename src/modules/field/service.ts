import type { Prisma } from '@prisma/client';
import type { TenantContext } from '@/modules/company/context';
import type { Command } from '@/modules/workspace/contracts';
import { notFound } from '@/server/http/errors';
import { requireProject } from '@/modules/projects/repository';

export async function fieldCommand(tx: Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'issue'|'task'|'report'|'document'}>){
  const companyId=ctx.companyId,projectId=cmd.payload.projectId;
  await requireProject(tx,ctx,projectId);
  if(cmd.action==='issue'){
    const engineer=await tx.user.findFirst({where:{companyId,role:'PTO'},orderBy:{id:'asc'}});
    const floor=await tx.floor.findFirst({where:{companyId,projectId,level:2},orderBy:{id:'asc'}});
    return tx.issue.create({data:{companyId,projectId,title:cmd.payload.title,description:cmd.payload.description,imageUrl:cmd.payload.imageUrl||null,category:'Structural / reinforcement',priority:'HIGH',status:engineer?'ASSIGNED':'OPEN',assigneeId:engineer?.id,floorId:floor?.id}});
  }
  if(cmd.action==='task'){
    const result=await tx.task.updateMany({where:{id:cmd.payload.id,companyId,projectId},data:{status:cmd.payload.status}});
    if(!result.count)notFound('Task');return;
  }
  if(cmd.action==='report')return tx.dailyReport.create({data:{companyId,projectId,date:new Date(`${cmd.payload.date}T00:00:00Z`),weather:cmd.payload.weather,laborCount:Number(cmd.payload.labor),delayNotes:cmd.payload.notes||null,authorRole:ctx.role,generatedText:`Daily site report · ${cmd.payload.date}. Weather: ${cmd.payload.weather}. Workforce: ${cmd.payload.labor}. Delay notes: ${cmd.payload.notes||'No delays reported'}.`}});
  // Document binaries will be added in stage 5. Only versioned metadata is persisted here.
  await tx.project.update({where:{id_companyId:{id:projectId,companyId}},data:{progress:{increment:0}}});
  const previous=await tx.document.aggregate({where:{companyId,projectId,name:cmd.payload.name},_max:{version:true}});
  return tx.document.create({data:{companyId,projectId,name:cmd.payload.name,version:(previous._max.version||0)+1,storageKey:`metadata-only/${crypto.randomUUID()}`}});
}
