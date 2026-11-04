import type { Prisma } from '@prisma/client';
import type { TenantContext } from '@/modules/company/context';
import type { Command } from '@/modules/workspace/contracts';
import { notFound } from '@/server/http/errors';
import { requireProject } from '@/modules/projects/repository';

export async function fieldCommand(tx: Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'issueStatus'|'createTask'|'issue'|'task'|'report'|'document'}>){
  const companyId=ctx.companyId,projectId=cmd.payload.projectId;
  await requireProject(tx,ctx,projectId);
  if(cmd.action==='createTask'){
    if(cmd.payload.assigneeId&&!await tx.user.findUnique({where:{id_companyId:{id:cmd.payload.assigneeId,companyId}}}))notFound('Assignee');
    return tx.task.create({data:{companyId,projectId,title:cmd.payload.title,description:cmd.payload.description,priority:cmd.payload.priority,dueDate:new Date(cmd.payload.dueDate+'T00:00:00Z'),assigneeId:cmd.payload.assigneeId||null}});
  }
  if(cmd.action==='issue'){
    const {floorId,assigneeId}=cmd.payload;
    if(floorId&&!await tx.floor.findFirst({where:{id:floorId,companyId,projectId}}))notFound('Floor');
    if(assigneeId&&!await tx.user.findFirst({where:{id:assigneeId,companyId}}))notFound('Assignee');
    return tx.issue.create({data:{companyId,projectId,title:cmd.payload.title,description:cmd.payload.description,imageUrl:cmd.payload.imageUrl||null,priority:cmd.payload.priority,status:assigneeId?'ASSIGNED':'OPEN',assigneeId:assigneeId||null,floorId:floorId||null}});
  }
  if(cmd.action==='issueStatus'){
    const result=await tx.issue.updateMany({where:{id:cmd.payload.id,companyId,projectId},data:{status:cmd.payload.status}});
    if(!result.count)notFound('Issue');return;
  }
  if(cmd.action==='task'){
    const result=await tx.task.updateMany({where:{id:cmd.payload.id,companyId,projectId},data:{status:cmd.payload.status}});
    if(!result.count)notFound('Task');return;
  }
  if(cmd.action==='report'){
    const weather=cmd.payload.weather+(cmd.payload.temperature!==undefined?` · ${cmd.payload.temperature}°C`:'');
    return tx.dailyReport.create({data:{companyId,projectId,date:new Date(`${cmd.payload.date}T00:00:00Z`),weather,laborCount:Number(cmd.payload.labor),delayNotes:cmd.payload.notes||null,authorRole:ctx.role,generatedText:`Daily site report · ${cmd.payload.date}. Weather: ${weather}. Workforce: ${cmd.payload.labor}. Delay notes: ${cmd.payload.notes||'No delays reported'}.`}});
  }
  // Document binaries will be added in stage 5. Only versioned metadata is persisted here.
  await tx.project.update({where:{id_companyId:{id:projectId,companyId}},data:{progress:{increment:0}}});
  const previous=await tx.document.aggregate({where:{companyId,projectId,name:cmd.payload.name},_max:{version:true}});
  return tx.document.create({data:{companyId,projectId,name:cmd.payload.name,version:(previous._max.version||0)+1,storageKey:`metadata-only/${crypto.randomUUID()}`}});
}
