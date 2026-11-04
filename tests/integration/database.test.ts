import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { db } from '@/server/db';
import { execute } from '@/modules/workspace/service';
import { readWorkspace } from '@/modules/workspace/repository';
import { answerQuestion } from '@/modules/ai/service';
import { commandSchema } from '@/modules/workspace/contracts';
import { demoContext } from '@/modules/company/context';
import { POST } from '@/app/api/workspace/commands/route';

const companyId=randomUUID(),otherId=randomUUID();
const ctx={companyId,role:'DIRECTOR' as const};
let projectId='',tenderId='',otherTender='',otherUser='';
const savedTenant=process.env.DEMO_COMPANY_ID,savedDemo=process.env.DEMO_MODE;
async function command(action:string,payload:Record<string,string>={}){await execute(ctx,commandSchema.parse({role:'DIRECTOR',action,payload}));}
before(async()=>{
 await db().$queryRaw`SELECT 1`;
 await db().company.createMany({data:[{id:companyId,name:'Integration fixture',bin:`test-${companyId}`},{id:otherId,name:'Other fixture',bin:`test-${otherId}`} ]});
 otherUser=(await db().user.create({data:{companyId:otherId,email:'other@fixture.demo',name:'Other engineer',role:'PTO'}})).id;
 otherTender=(await db().tender.create({data:{companyId:otherId,title:'Private',clientName:'Other',estimatedBudget:1}})).id;
 process.env.DEMO_COMPANY_ID=companyId;process.env.DEMO_MODE='true';
});
after(async()=>{
 if(savedTenant===undefined)delete process.env.DEMO_COMPANY_ID;else process.env.DEMO_COMPANY_ID=savedTenant;
 if(savedDemo===undefined)delete process.env.DEMO_MODE;else process.env.DEMO_MODE=savedDemo;
 const where={companyId:{in:[companyId,otherId]}};
 // Delete only these randomly generated test tenants, never application/seed records.
 await db().$transaction(async tx=>{
  await tx.purchaseRequest.deleteMany({where});await tx.aiRiskAlert.deleteMany({where});await tx.task.deleteMany({where});await tx.issue.deleteMany({where});
  await tx.document.deleteMany({where});await tx.dailyReport.deleteMany({where});await tx.zone.deleteMany({where});await tx.floor.deleteMany({where});await tx.building.deleteMany({where});
  await tx.project.deleteMany({where});await tx.tender.deleteMany({where});await tx.invitation.deleteMany({where});await tx.user.deleteMany({where});await tx.company.deleteMany({where:{id:{in:[companyId,otherId]}}});
 });
 await db().$disconnect();
});
test('PostgreSQL lifecycle, persistence, concurrency and tenant foreign keys',async()=>{
 await command('newTender',{title:'Alatau',client:'Client'});
 let workspace=await readWorkspace(ctx);assert.equal(workspace.state.tenders.length,1);tenderId=workspace.state.tenders[0].id;
 await command('analyze',{id:tenderId});
 await Promise.all([command('convert',{id:tenderId}),command('convert',{id:tenderId})]);
 workspace=await readWorkspace(ctx);assert.equal(workspace.state.projects.length,1);projectId=workspace.state.projects[0].id;
 assert.equal(workspace.state.projects[0].buildings.length,0);
 await command('building',{projectId,name:'Custom Block'});
 const building=await db().building.findFirstOrThrow({where:{companyId,projectId}});
 await command('floor',{projectId,buildingId:building.id,level:'3'});
 const floor=await db().floor.findFirstOrThrow({where:{companyId,projectId}});
 await command('zone',{projectId,floorId:floor.id,name:'My Zone'});
 workspace=await readWorkspace(ctx);assert.equal(workspace.state.projects[0].buildings[0].floors[0].level,3);
 assert.equal(workspace.state.projects[0].buildings[0].floors[0].zones[0],'My Zone');
 await db().aiRiskAlert.create({data:{companyId,projectId,severity:'CRITICAL',title:'Fixture risk',reason:'Test',impact:'Test',suggestion:'Test'}});
 workspace=await readWorkspace(ctx);assert.equal(workspace.state.tenders[0].score,78);
 await execute({companyId,role:'FOREMAN'},commandSchema.parse({action:'issue',role:'FOREMAN',payload:{projectId,title:'Mesh defect',description:'Inspect spacing'}}));
 await command('report',{projectId,date:'2026-10-10',weather:'Rain',labor:'24',notes:'Review'});
 await Promise.all([command('document',{projectId,name:'drawing.pdf'}),command('document',{projectId,name:'drawing.pdf'})]);
 const riskId=workspace.state.risks[0].id;
 await Promise.all([command('purchase',{projectId,id:riskId}),command('purchase',{projectId,id:riskId})]);
 await db().$disconnect(); // Reconnect: state must survive process connections, not a JS memory store.
 workspace=await readWorkspace(ctx);
 assert.equal(workspace.state.issues.length,1);assert.equal(workspace.state.reports[0].labor,'24');assert.equal(workspace.state.requests.length,1);
 assert.equal(workspace.state.requests[0].status,'PENDING_APPROVAL');assert.deepEqual(workspace.state.documents.map(d=>d.version).sort(),[1,2]);
 assert.equal(workspace.state.tenders.some(t=>t.id===otherTender),false);
 await assert.rejects(db().tender.create({data:{companyId,title:'Invalid budget',clientName:'Fixture',estimatedBudget:-1}}));
 await assert.rejects(db().dailyReport.create({data:{companyId,projectId,date:new Date(),weather:'Rain',laborCount:-1,authorRole:'FOREMAN',generatedText:'Invalid'}}));
 await assert.rejects(command('analyze',{id:otherTender}),/not found/);
 await assert.rejects(db().task.create({data:{companyId,projectId,title:'Cross-tenant assignment',assigneeId:otherUser,dueDate:new Date()}}));
 const ai=await answerQuestion(ctx,{role:'DIRECTOR',projectId,question:'Block A risks?',language:'ru'});
 assert.ok(ai.answer.includes('Открытых дефектов: 1'));assert.ok(ai.answer.includes('заявок на согласовании: 1'));
 const invalid=await POST(new Request('http://localhost/api/workspace/commands',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost'},body:JSON.stringify({action:'newTender',role:'DIRECTOR',state:{},payload:{title:'Fake',client:'Fake'}})}));
 assert.equal(invalid.status,422);
 await assert.rejects(execute({companyId,role:'FOREMAN'},commandSchema.parse({action:'purchase',role:'FOREMAN',payload:{projectId,id:riskId}})),/Your role cannot/);
 await assert.rejects(command('analyze',{id:otherTender}),/not found/);
 const invitationBefore=workspace.state.users.length;
 await command('invite',{name:'Invited engineer',email:'engineer@fixture.demo',role:'PTO'});
 assert.equal((await readWorkspace(ctx)).state.users.length,invitationBefore+1);
 process.env.DEMO_MODE='false';
 assert.throws(()=>demoContext('DIRECTOR'),/Demo access is disabled/);
});
