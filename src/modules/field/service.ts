import {reviewIssue} from './review';
import type { Prisma } from '@prisma/client';
import type { TenantContext } from '@/modules/company/context';
import type { Command } from '@/modules/workspace/contracts';
import { notFound } from '@/server/http/errors';
import { requireProject } from '@/modules/projects/repository';

export async function fieldCommand(tx: Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'editReport'|'editTask'|'issueStatus'|'createTask'|'issue'|'task'|'report'|'document'}>){
  const companyId=ctx.companyId,projectId=cmd.payload.projectId;
  await requireProject(tx,ctx,projectId);
  if(cmd.action==='createTask'||cmd.action==='editTask'){
    if(cmd.payload.assigneeId&&!await tx.user.findUnique({where:{id_companyId:{id:cmd.payload.assigneeId,companyId}}}))notFound('Assignee');
    if(cmd.payload.issueId&&!await tx.issue.findFirst({where:{id:cmd.payload.issueId,companyId,projectId}}))notFound('Issue');
    const data={title:cmd.payload.title,description:cmd.payload.description||null,priority:cmd.payload.priority,dueDate:new Date(cmd.payload.dueDate+'T00:00:00Z'),assigneeId:cmd.payload.assigneeId||null,issueId:cmd.payload.issueId||null};
    if(cmd.action==='editTask'){const result=await tx.task.updateMany({where:{id:cmd.payload.id,companyId,projectId},data});if(!result.count)notFound('Task');return;}
    return tx.task.create({data:{companyId,projectId,...data}});
  }
  if(cmd.action==='issue'){
    const {floorId,assigneeId}=cmd.payload;
    if(floorId&&!await tx.floor.findFirst({where:{id:floorId,companyId,projectId}}))notFound('Floor');
    if(assigneeId&&!await tx.user.findFirst({where:{id:assigneeId,companyId}}))notFound('Assignee');
    return tx.issue.create({data:{companyId,projectId,reporterId:ctx.userId||null,title:cmd.payload.title,description:cmd.payload.description,imageUrl:cmd.payload.imageUrl||null,priority:cmd.payload.priority,status:assigneeId?'ASSIGNED':'OPEN',assigneeId:assigneeId||null,floorId:floorId||null}});
  }
  if(cmd.action==='issueStatus'){
    return reviewIssue(tx,ctx,cmd.payload);
  }
  if(cmd.action==='task'){
    const result=await tx.task.updateMany({where:{id:cmd.payload.id,companyId,projectId},data:{status:cmd.payload.status}});
    if(!result.count)notFound('Task');return;
  }
  if(cmd.action==='report'||cmd.action==='editReport'){
    const weather=cmd.payload.weather+(cmd.payload.temperature!==undefined?` · ${cmd.payload.temperature}°C`:'');
    const data={companyId,projectId,date:new Date(`${cmd.payload.date}T00:00:00Z`),weather,laborCount:Number(cmd.payload.labor),delayNotes:cmd.payload.notes||null,authorRole:ctx.role,generatedText:`Daily site report · ${cmd.payload.date}. Weather: ${weather}. Workforce: ${cmd.payload.labor}. Delay notes: ${cmd.payload.notes||'No delays reported'}.`};
    if(cmd.action==='editReport'){const result=await tx.dailyReport.updateMany({where:{id:cmd.payload.id,companyId,projectId},data});if(!result.count)notFound('Report');return;}
    if(cmd.payload.clientId){const existing=await tx.dailyReport.findUnique({where:{clientId:cmd.payload.clientId}});if(existing){if(existing.companyId!==companyId||existing.projectId!==projectId)notFound('Report');return;}}
    return tx.dailyReport.create({data:{...data,clientId:cmd.payload.clientId}});
  }
  // Document binaries will be added in stage 5. Only versioned metadata is persisted here.
  await tx.project.update({where:{id_companyId:{id:projectId,companyId}},data:{progress:{increment:0}}});
  const previous=await tx.document.aggregate({where:{companyId,projectId,name:cmd.payload.name},_max:{version:true}});
  return tx.document.create({data:{companyId,projectId,name:cmd.payload.name,version:(previous._max.version||0)+1,storageKey:`metadata-only/${crypto.randomUUID()}`}});
}
