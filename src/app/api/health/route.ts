import { endpoint } from '@/server/http/errors';
import { db } from '@/server/db';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return endpoint(async()=>{
 await db().$queryRaw`SELECT 1`;
 // A successful ping alone does not prove that migrations were applied.
 await db().company.count();
 return {status:'ok',database:'postgresql',schema:'ready'};
});}
