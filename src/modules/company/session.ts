import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from '@/server/db';
import { AppError } from '@/server/http/errors';

export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
export async function createSession(userId:string){
 const token=randomBytes(32).toString('hex');
 const expiresAt=new Date(Date.now()+7*86400000);
 await db().session.create({data:{tokenHash:tokenHash(token),userId,expiresAt}});
 (await cookies()).set('buildos_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',expires:expiresAt});
}
export async function currentUser(){
 const token=(await cookies()).get('buildos_session')?.value;
 if(!token)throw new AppError(401,'AUTH_REQUIRED','Authentication required.');
 const session=await db().session.findUnique({where:{tokenHash:tokenHash(token)},include:{user:true}});
 if(!session||session.expiresAt<new Date())throw new AppError(401,'AUTH_REQUIRED','Authentication required.');
 return session.user;
}
export async function sessionContext(){const user=await currentUser();return {companyId:user.companyId,role:user.role,userId:user.id};}
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');
 const expectedHost=request.headers.get('host')||new URL(request.url).host;
 if(!origin||new URL(origin).host!==expectedHost)throw new AppError(403,'INVALID_ORIGIN','Request origin is not allowed.');
}
