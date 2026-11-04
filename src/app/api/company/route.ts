import { endpoint,AppError } from '@/server/http/errors';
import { jsonBody } from '@/server/http/body';
import { sessionContext,sameOrigin } from '@/modules/company/session';
import { db } from '@/server/db';
import { manage,managementSchema } from '@/modules/company/management';
export async function GET(){return endpoint(async()=>{
 const ctx=await sessionContext();
 if(ctx.role!=='DIRECTOR')throw new AppError(403,'FORBIDDEN','Director access required.');
 const company=await db().company.findUniqueOrThrow({where:{id:ctx.companyId},select:{name:true,bin:true,address:true}});
 const users=await db().user.findMany({where:{companyId:ctx.companyId},select:{id:true,name:true,email:true,role:true},orderBy:{name:'asc'}});
 const invitations=await db().invitation.findMany({where:{companyId:ctx.companyId,acceptedAt:null},select:{id:true,name:true,email:true,role:true,expiresAt:true},orderBy:{expiresAt:'desc'}});
 const projects=await db().project.findMany({where:{companyId:ctx.companyId},select:{id:true,name:true,members:{select:{userId:true}}}});
 return {company,users,invitations,projects,viewerId:ctx.userId};
});}
export async function POST(request:Request){return endpoint(async()=>{
 sameOrigin(request);const ctx=await sessionContext();return manage(ctx,managementSchema.parse(await jsonBody(request,16000)));
});}
