import { cookies } from 'next/headers';
import { endpoint, AppError } from '@/server/http/errors';
import { jsonBody } from '@/server/http/body';
import { login,register,loginSchema,registerSchema } from '@/modules/company/auth';
import { createSession,currentUser,sameOrigin,tokenHash } from '@/modules/company/session';
import { db } from '@/server/db';

export const runtime='nodejs';
export async function GET(){return endpoint(async()=>{const u=await currentUser();return {user:{id:u.id,name:u.name,email:u.email,role:u.role,companyId:u.companyId}}});}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){return endpoint(async()=>{
 sameOrigin(request);const {action}=await params;
 if(action==='logout'){
  const jar=await cookies(),token=jar.get('buildos_session')?.value;
  if(token)await db().session.deleteMany({where:{tokenHash:tokenHash(token)}});
  jar.delete('buildos_session');return {ok:true};
 }
 const body=await jsonBody(request,16000);
 const user=action==='register'?await register(registerSchema.parse(body)):action==='login'?await login(loginSchema.parse(body)):null;
 if(!user)throw new AppError(404,'NOT_FOUND','Endpoint not found.');
 await createSession(user.id);return {user:{id:user.id,name:user.name,role:user.role,companyId:user.companyId}};
});}
