import { compare, hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/server/db';
import { AppError } from '@/server/http/errors';

const credentials={email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(12).max(72).refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password exceeds 72 bytes')};
export const loginSchema=z.object({...credentials,bin:z.string().regex(/^\d{12}$/)}).strict();
export const registerSchema=loginSchema.extend({name:z.string().trim().min(2).max(100),company:z.string().trim().min(2).max(200)});
export async function register(input:z.infer<typeof registerSchema>){
 const passwordHash=await hash(input.password,12);
 return db().$transaction(async tx=>{
  const company=await tx.company.create({data:{name:input.company,bin:input.bin}});
  return tx.user.create({data:{companyId:company.id,name:input.name,email:input.email,role:'DIRECTOR',passwordHash}});
 });
}
export async function login(input:z.infer<typeof loginSchema>){
 const key=`${input.bin}:${input.email}`;
 const attempt=await db().loginAttempt.upsert({where:{key},create:{key,count:1,windowStart:new Date()},update:{count:{increment:1}}});
 if(Date.now()-attempt.windowStart.getTime()>15*60000)await db().loginAttempt.update({where:{key},data:{count:1,windowStart:new Date()}});
 else if(attempt.count>8)throw new AppError(429,'RATE_LIMITED','Too many attempts. Retry in 15 minutes.');
 const user=await db().user.findFirst({where:{email:input.email,company:{bin:input.bin}}});
 // Compare a real bcrypt hash even for unknown accounts to reduce timing differences.
 const dummy='$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';
 const valid=await compare(input.password,user?.passwordHash||dummy);
 if(!user?.passwordHash||!valid)throw new AppError(401,'INVALID_CREDENTIALS','Invalid credentials.');
 await db().loginAttempt.delete({where:{key}}).catch(()=>undefined);
 return user;
}
