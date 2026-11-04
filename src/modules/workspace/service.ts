import {structureCommand} from '@/modules/projects/structure';
import {requireProjectAccess} from '@/modules/company/access';
import {changeTender} from '@/modules/tenders/lifecycle';
import {editProject} from '@/modules/projects/edit';
import {changeStructure} from '@/modules/projects/change-structure';
import {materials} from '@/modules/procurement/materials';
import { db } from '@/server/db';
import { requirePermission, type TenantContext } from '@/modules/company/context';
import { tenderCommand } from '@/modules/tenders/service';
import { fieldCommand } from '@/modules/field/service';
import { invitationCommand } from '@/modules/company/service';
import { purchaseCommand } from '@/modules/procurement/service';
import type { Command } from './contracts';

const permissions={changeStructure:'project',building:'project',floor:'project',zone:'project',issueStatus:'issue',editTender:'tender',tenderStatus:'tender',createProject:'project',editProject:'project',newTender:'tender',analyze:'tender',convert:'project',issue:'issue',editTask:'task',createTask:'task',task:'task',report:'report',cashFlow:'finance',editReport:'report',materialRequest:'material',purchaseDecision:'material',purchase:'purchase',invite:'invite',document:'document'} as const;
export async function execute(ctx:TenantContext,cmd:Command){
  requirePermission(ctx,permissions[cmd.action]);
  await db().$transaction(async tx=>{
    if(cmd.payload.projectId)await requireProjectAccess(tx,ctx,cmd.payload.projectId);
    if(cmd.action==='cashFlow'){await tx.cashFlow.create({data:{companyId:ctx.companyId,projectId:cmd.payload.projectId,direction:cmd.payload.direction,amount:cmd.payload.amount,date:new Date(cmd.payload.date+'T00:00:00Z'),note:cmd.payload.note}});return;}
    switch(cmd.action){
      case 'changeStructure':await changeStructure(tx,ctx,cmd);break;
      case 'building':case 'floor':case 'zone':await structureCommand(tx,ctx,cmd);break;
      case 'editTender':case 'tenderStatus':await changeTender(tx,ctx,cmd);break;
      case 'createProject':case 'editProject':await editProject(tx,ctx,cmd);break;
      case 'newTender':case 'analyze':case 'convert':await tenderCommand(tx,ctx,cmd);break;
      case 'issueStatus':case 'editReport':case 'editTask':case 'createTask':case 'issue':case 'task':case 'report':case 'document':await fieldCommand(tx,ctx,cmd);break;
      case 'invite':await invitationCommand(tx,ctx,cmd);break;
      case 'materialRequest':case 'purchaseDecision':await materials(tx,ctx,cmd);break;
      case 'purchase':await purchaseCommand(tx,ctx,cmd);break;
    }
  },{maxWait:5000,timeout:15000});
}
