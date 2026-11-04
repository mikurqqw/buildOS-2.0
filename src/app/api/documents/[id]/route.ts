import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {db} from '@/server/db';
import {endpoint,AppError} from '@/server/http/errors';
import {sessionContext} from '@/modules/company/session';
import {projectFilter} from '@/modules/company/access';
import {z} from 'zod';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 let download:Response|undefined;
 const result=await endpoint(async()=>{
  const ctx=await sessionContext();if(ctx.role==='ACCOUNTANT')throw new AppError(403,'FORBIDDEN','Document access is restricted.');
  const id=z.string().uuid().parse((await params).id);
  const doc=await db().document.findFirst({where:{id,companyId:ctx.companyId,project:projectFilter(ctx)}});
  if(!doc||!/^[-a-f0-9]{36}\.(pdf|docx|xlsx)$/.test(doc.storageKey))throw new AppError(404,'NOT_FOUND','Document file not found.');
  let bytes:Buffer;try{bytes=await readFile(resolve('.data/uploads',doc.storageKey))}catch{throw new AppError(404,'NOT_FOUND','Document file not found.')}
  download=new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/octet-stream','Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(doc.name)}`,'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store'}});return {ok:true};
 });return download||result;
}
