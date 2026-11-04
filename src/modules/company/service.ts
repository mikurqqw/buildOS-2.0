import { createHash, randomBytes } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import type { TenantContext } from './context';
import type { Command } from '@/modules/workspace/contracts';
import { AppError } from '@/server/http/errors';

export async function invitationCommand(tx:Prisma.TransactionClient,ctx:TenantContext,cmd:Extract<Command,{action:'invite'}>){
  const email=cmd.payload.email;
  if(await tx.user.findUnique({where:{companyId_email:{companyId:ctx.companyId,email}}}))throw new AppError(409,'ALREADY_MEMBER','This email is already a company member.');
  const tokenHash=createHash('sha256').update(randomBytes(32)).digest('hex');
  const data={name:cmd.payload.name,email,role:cmd.payload.role,tokenHash,expiresAt:new Date(Date.now()+7*86400000),acceptedAt:null};
  return tx.invitation.upsert({where:{companyId_email:{companyId:ctx.companyId,email}},create:{companyId:ctx.companyId,...data},update:data});
}
