import {financialAccess,projectBudgetAccess,tenderAccess,projectFilter} from '@/modules/company/access';
import { Prisma } from '@prisma/client';
import { db } from '@/server/db';
import type { TenantContext } from '@/modules/company/context';
import type { State } from '@/lib/domain';
import { notFound } from '@/server/http/errors';

export async function readWorkspace(ctx:TenantContext):Promise<{state:State;company:{id:string;name:string};storage:'postgresql'}>{
 return db().$transaction(async tx=>{
  const companyId=ctx.companyId,where={companyId},orderBy={createdAt:'asc' as const};
  const company=await tx.company.findUnique({where:{id:companyId},select:{id:true,name:true}});if(!company)notFound('Company');
  const allowed=await tx.project.findMany({where:projectFilter(ctx),select:{id:true}});
  const scoped={companyId,projectId:{in:allowed.map(p=>p.id)}};
  const [tenders,projects,tasks,issues,risks,reports,requests,documents,users,invitations]=await Promise.all([
   tx.tender.findMany({where:{...where,...(!tenderAccess(ctx)?{id:'no-access'}:{})},orderBy}),
   tx.project.findMany({where:projectFilter(ctx),orderBy,include:{buildings:{orderBy:{name:'asc'},include:{floors:{orderBy:{level:'asc'},include:{zones:{orderBy:{name:'asc'}}}}}}}}),
   tx.task.findMany({where:scoped,orderBy,include:{assignee:true}}),tx.issue.findMany({where:scoped,orderBy,include:{assignee:true,history:{orderBy:{createdAt:'asc'}}}}),
   tx.aiRiskAlert.findMany({where:scoped,orderBy}),tx.dailyReport.findMany({where:scoped,orderBy}),tx.purchaseRequest.findMany({where:scoped,orderBy}),
   tx.document.findMany({select:{id:true,projectId:true,name:true,version:true,storageKey:true},where:{...scoped,...(ctx.role==='ACCOUNTANT'?{id:'no-access'}:{})},orderBy}),tx.user.findMany({where,orderBy,select:{id:true,name:true,email:true,role:true}}),
   tx.invitation.findMany({where:{companyId,...(ctx.role!=='DIRECTOR'?{id:'no-access'}:{}),acceptedAt:null,expiresAt:{gt:new Date()}},select:{id:true,name:true,email:true,role:true}}),
  ]);
  const cashFlows=financialAccess(ctx)?await tx.cashFlow.findMany({where:scoped,orderBy:{date:'desc'}}):[];
  const state:State={cashFlows:cashFlows.map(c=>({id:c.id,projectId:c.projectId,direction:c.direction,amount:Number(c.amount),date:c.date.toISOString().slice(0,10),note:c.note})),
   tenders:tenders.map(t=>({id:t.id,companyId,title:t.title,clientName:t.clientName,budget:Number(t.estimatedBudget),durationMonths:t.durationMonths,status:t.status,document:t.documentName||undefined,score:t.aiTenderScore??undefined,margin:financialAccess(ctx)&&t.aiMarginPercent!==null?Number(t.aiMarginPercent):undefined,risks:Array.isArray(t.aiRiskSummary)?t.aiRiskSummary.filter((v):v is string=>typeof v==='string'):undefined})),
   projects:projects.map(p=>({id:p.id,companyId,tenderId:p.tenderId||undefined,name:p.name,budget:projectBudgetAccess(ctx)?Number(p.budget):0,progress:tasks.filter(t=>t.projectId===p.id).length?Math.round(tasks.filter(t=>t.projectId===p.id&&t.status==='DONE').length/tasks.filter(t=>t.projectId===p.id).length*100):p.progress,startDate:p.startDate.toISOString().slice(0,10),endDate:p.endDate.toISOString().slice(0,10),status:p.status,buildings:p.buildings.map(b=>({id:b.id,name:b.name,floors:b.floors.map(f=>({id:f.id,level:f.level,zoneEntries:f.zones.map(z=>({id:z.id,name:z.name})),zones:f.zones.map(z=>z.name)}))}))})),
   tasks:tasks.map(t=>({id:t.id,projectId:t.projectId,title:t.title,description:t.description||undefined,issueId:t.issueId||undefined,assigneeId:t.assigneeId||undefined,assignee:t.assignee?.name||(t.title==='Request façade materials for Block A'?'Procurement team':'Unassigned'),priority:t.priority,status:t.status,dueDate:t.dueDate.toISOString().slice(0,10)})),
   issues:issues.map(i=>({id:i.id,projectId:i.projectId,title:i.title,description:i.description,priority:i.priority,status:i.status,assignee:i.assignee?.name||'Unassigned',category:i.category||'',history:i.history.map(h=>({id:h.id,fromStatus:h.fromStatus,toStatus:h.toStatus,createdAt:h.createdAt.toISOString(),note:h.note||undefined})), floorId:i.floorId||undefined,imageUrl:i.imageUrl||undefined})),
   risks:risks.map(r=>({id:r.id,projectId:r.projectId,severity:r.severity,title:r.title,reason:r.reason,impact:r.impact,suggestion:r.suggestion,isActioned:r.isActioned})),
   reports:reports.map(r=>({id:r.id,projectId:r.projectId,text:r.generatedText,date:r.date.toISOString().slice(0,10),weather:r.weather,labor:String(r.laborCount),notes:r.delayNotes||undefined,author:r.authorRole})),
   requests:requests.map(r=>({id:r.id,projectId:r.projectId,title:r.title,status:r.status,events:Array.isArray(r.events)?r.events.filter((e):e is {status:string;at:string;actorId:string;note:string}=>!!e&&typeof e==='object'&&!Array.isArray(e)&&typeof e.status==='string'&&typeof e.at==='string'&&typeof e.actorId==='string'&&typeof e.note==='string'):[],decisionNote:r.decisionNote||undefined,approvedAt:r.approvedAt?.toISOString()})),documents:documents.map(d=>({id:d.id,projectId:d.projectId,name:d.name,version:d.version,hasFile:!d.storageKey.startsWith('metadata-only/') })),
   users:[...users.map(u=>({...u,status:'Active'})),...invitations.map(u=>({...u,status:'Invited (demo)'}))],
  };
  return {state,company,storage:'postgresql'};
 },{isolationLevel:Prisma.TransactionIsolationLevel.RepeatableRead,timeout:15000});
}
