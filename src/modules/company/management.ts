import { randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/server/db';
import { roles } from '@/modules/shared/types';
import { AppError,notFound } from '@/server/http/errors';
import { tokenHash } from './session';

const text=z.string().trim().min(2).max(200);
export const managementSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('membership'),userId:z.string().uuid(),projectId:z.string().uuid(),enabled:z.enum(['true','false'])}).strict(),
 z.object({action:z.literal('company'),name:text,address:z.string().trim().max(500)}).strict(),
 z.object({action:z.literal('role'),userId:z.string().uuid(),role:z.enum(roles)}).strict(),
 z.object({action:z.literal('invite'),name:text,email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),role:z.enum(roles)}).strict(),
 z.object({action:z.literal('revoke'),id:z.string().uuid()}).strict(),
]);
export const acceptSchema=z.object({token:z.string().regex(/^[a-f0-9]{64}$/),password:z.string().min(12).max(72).refine(v=>Buffer.byteLength(v)<=72)}).strict();
type Actor={companyId:string;userId:string;role:string};
export async function manage(actor:Actor,input:z.infer<typeof managementSchema>){
 if(actor.role!=='DIRECTOR')throw new AppError(403,'FORBIDDEN','Director access required.');
 return db().$transaction(async tx=>{
  const companyId=actor.companyId;
  if(input.action==='membership'){
   if(!await tx.project.findFirst({where:{id:input.projectId,companyId}})||!await tx.user.findFirst({where:{id:input.userId,companyId}}))notFound('Project member');
   if(input.enabled==='true')await tx.projectMember.upsert({where:{projectId_userId:{projectId:input.projectId,userId:input.userId}},create:{companyId,projectId:input.projectId,userId:input.userId},update:{}});
   else await tx.projectMember.deleteMany({where:{companyId,projectId:input.projectId,userId:input.userId}});
   return {ok:true};
  }
  // Serialize director changes so concurrent demotions cannot leave a company without a director.
  await tx.$queryRaw`SELECT "id" FROM "Company" WHERE "id" = ${companyId} FOR UPDATE`;
  if(input.action==='company')return tx.company.update({where:{id:companyId},data:{name:input.name,address:input.address}});
  if(input.action==='role'){
   const user=await tx.user.findUnique({where:{id_companyId:{id:input.userId,companyId}}});if(!user)notFound('User');
   if(user.id===actor.userId)throw new AppError(409,'SELF_ROLE_CHANGE','You cannot change your own role.');
   await tx.user.update({where:{id_companyId:{id:user.id,companyId}},data:{role:input.role}});
   await tx.session.deleteMany({where:{userId:user.id}});return {ok:true};
  }
  if(input.action==='revoke'){
   const result=await tx.invitation.deleteMany({where:{id:input.id,companyId,acceptedAt:null}});
   if(!result.count)notFound('Invitation');return {ok:true};
  }
  if(await tx.user.findUnique({where:{companyId_email:{companyId,email:input.email}}}))throw new AppError(409,'ALREADY_MEMBER','This email is already a company member.');
  const token=randomBytes(32).toString('hex');
  const data={name:input.name,email:input.email,role:input.role,tokenHash:tokenHash(token),expiresAt:new Date(Date.now()+7*86400000),acceptedAt:null};
  await tx.invitation.upsert({where:{companyId_email:{companyId,email:input.email}},create:{companyId,...data},update:data});
  return {token}; // Returned once to the director; only the hash is stored.
 });
}
export async function acceptInvitation(input:z.infer<typeof acceptSchema>){
 const passwordHash=await hash(input.password,12);
 return db().$transaction(async tx=>{
  const invitation=await tx.invitation.findUnique({where:{tokenHash:tokenHash(input.token)}});
  if(!invitation||invitation.acceptedAt||invitation.expiresAt<new Date())throw new AppError(410,'INVITATION_EXPIRED','Invitation is invalid or expired.');
  const claimed=await tx.invitation.updateMany({where:{id:invitation.id,acceptedAt:null,expiresAt:{gt:new Date()}},data:{acceptedAt:new Date()}});
  if(!claimed.count)throw new AppError(410,'INVITATION_EXPIRED','Invitation is invalid or expired.');
  return tx.user.create({data:{companyId:invitation.companyId,name:invitation.name,email:invitation.email,role:invitation.role,passwordHash}});
 });
}
