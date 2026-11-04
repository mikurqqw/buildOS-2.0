import { db } from '@/server/db';
import { requirePermission, type TenantContext } from '@/modules/company/context';
import { tenderCommand } from '@/modules/tenders/service';
import { fieldCommand } from '@/modules/field/service';
import { invitationCommand } from '@/modules/company/service';
import { purchaseCommand } from '@/modules/procurement/service';
import type { Command } from './contracts';

const permissions={newTender:'tender',analyze:'tender',convert:'project',issue:'issue',createTask:'task',task:'task',report:'report',purchase:'purchase',invite:'invite',document:'document'} as const;
export async function execute(ctx:TenantContext,cmd:Command){
  requirePermission(ctx,permissions[cmd.action]);
  await db().$transaction(async tx=>{
    switch(cmd.action){
      case 'newTender':case 'analyze':case 'convert':await tenderCommand(tx,ctx,cmd);break;
      case 'createTask':case 'issue':case 'task':case 'report':case 'document':await fieldCommand(tx,ctx,cmd);break;
      case 'invite':await invitationCommand(tx,ctx,cmd);break;
      case 'purchase':await purchaseCommand(tx,ctx,cmd);break;
    }
  },{maxWait:5000,timeout:15000});
}
