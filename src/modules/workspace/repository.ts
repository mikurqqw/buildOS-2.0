import { Prisma } from '@prisma/client';
import { db } from '@/server/db';
import type { TenantContext } from '@/modules/company/context';
import type { State } from '@/lib/domain';
import { notFound } from '@/server/http/errors';

export async function readWorkspace(ctx:TenantContext):Promise<{state:State;company:{id:string;name:string};storage:'postgresql'}>{
 return db().$transaction(async tx=>{
  const companyId=ctx.companyId,where={companyId},orderBy={createdAt:'asc' as const};
  const company=await tx.company.findUnique({where:{id:companyId},select:{id:true,name:true}});if(!company)notFound('Company');
  const [tenders,projects,tasks,issues,risks,reports,requests,documents,users,invitations]=await Promise.all([
   tx.tender.findMany({where,orderBy}),
   tx.project.findMany({where,orderBy,include:{buildings:{orderBy:{name:'asc'},include:{floors:{orderBy:{level:'asc'},include:{zones:{orderBy:{name:'asc'}}}}}}}}),
   tx.task.findMany({where,orderBy,include:{assignee:true}}),tx.issue.findMany({where,orderBy,include:{assignee:true}}),
   tx.aiRiskAlert.findMany({where,orderBy}),tx.dailyReport.findMany({where,orderBy}),tx.purchaseRequest.findMany({where,orderBy}),
   tx.document.findMany({where,orderBy}),tx.user.findMany({where,orderBy,select:{id:true,name:true,email:true,role:true}}),
   tx.invitation.findMany({where:{companyId,acceptedAt:null,expiresAt:{gt:new Date()}},select:{id:true,name:true,email:true,role:true}}),
  ]);
  const state:State={
   tenders:tenders.map(t=>({id:t.id,companyId,title:t.title,clientName:t.clientName,budget:Number(t.estimatedBudget),durationMonths:t.durationMonths,status:t.status,document:t.documentName||undefined,score:t.aiTenderScore??undefined,margin:t.aiMarginPercent===null?undefined:Number(t.aiMarginPercent),risks:Array.isArray(t.aiRiskSummary)?t.aiRiskSummary.filter((v):v is string=>typeof v==='string'):undefined})),
   projects:projects.map(p=>({id:p.id,companyId,tenderId:p.tenderId||undefined,name:p.name,budget:Number(p.budget),progress:p.progress,status:p.status,buildings:p.buildings.map(b=>({id:b.id,name:b.name,floors:b.floors.map(f=>({id:f.id,level:f.level,zones:f.zones.map(z=>z.name)}))}))})),
   tasks:tasks.map(t=>({id:t.id,projectId:t.projectId,title:t.title,assignee:t.assignee?.name||(t.title==='Request façade materials for Block A'?'Procurement team':'Unassigned'),priority:t.priority,status:t.status,dueDate:t.dueDate.toISOString().slice(0,10)})),
   issues:issues.map(i=>({id:i.id,projectId:i.projectId,title:i.title,description:i.description,priority:i.priority,status:i.status,assignee:i.assignee?.name||'Unassigned',category:i.category||'',floorId:i.floorId||undefined,imageUrl:i.imageUrl||undefined})),
   risks:risks.map(r=>({id:r.id,projectId:r.projectId,severity:r.severity,title:r.title,reason:r.reason,impact:r.impact,suggestion:r.suggestion,isActioned:r.isActioned})),
   reports:reports.map(r=>({id:r.id,projectId:r.projectId,text:r.generatedText,date:r.date.toISOString().slice(0,10),weather:r.weather,labor:String(r.laborCount),notes:r.delayNotes||undefined,author:r.authorRole})),
   requests:requests.map(r=>({id:r.id,projectId:r.projectId,title:r.title,status:r.status})),documents:documents.map(d=>({id:d.id,projectId:d.projectId,name:d.name,version:d.version})),
   users:[...users.map(u=>({...u,status:'Active'})),...invitations.map(u=>({...u,status:'Invited (demo)'}))],
  };
  return {state,company,storage:'postgresql'};
 },{isolationLevel:Prisma.TransactionIsolationLevel.RepeatableRead,timeout:15000});
}
