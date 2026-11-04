import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';
import {endpoint,AppError} from '@/server/http/errors';
import {sessionContext,sameOrigin} from '@/modules/company/session';
import {requirePermission} from '@/modules/company/context';
import {requireProject} from '@/modules/projects/repository';
import {db} from '@/server/db';
import {readWorkspace} from '@/modules/workspace/repository';
export const runtime='nodejs';
const max=10*1024*1024;
export async function POST(request:Request){return endpoint(async()=>{
 sameOrigin(request);const ctx=await sessionContext();requirePermission(ctx,'document');
 if(!request.body)throw new AppError(400,'EMPTY_UPLOAD','Choose a file.');
 const reader=request.body.getReader(),chunks:Uint8Array[]=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max+65536){await reader.cancel();throw new AppError(413,'PAYLOAD_TOO_LARGE','Maximum file size is 10 MB.')}chunks.push(value)}
 const body=Buffer.concat(chunks);let form:FormData;
 try{form=await new Response(body,{headers:{'Content-Type':request.headers.get('content-type')||''}}).formData()}catch{throw new AppError(400,'INVALID_UPLOAD','Invalid upload.')}
 const projectId=z.string().uuid().parse(form.get('projectId'));const file=form.get('file');
 if(!(file instanceof File)||file.size<1||file.size>max)throw new AppError(422,'INVALID_FILE','Choose a PDF, DOCX or XLSX up to 10 MB.');
 const name=z.string().max(255).regex(/\.(pdf|docx|xlsx)$/i).parse(file.name);const ext=name.split('.').pop()!.toLowerCase();const bytes=Buffer.from(await file.arrayBuffer());
 const pdf=bytes.subarray(0,5).toString()==='%PDF-';const zip=bytes.subarray(0,4).equals(Buffer.from([80,75,3,4]));
 const office=zip&&bytes.includes(Buffer.from('[Content_Types].xml'))&&bytes.includes(Buffer.from(ext==='docx'?'word/':'xl/'));
 if(ext==='pdf'?!pdf:!office)throw new AppError(422,'INVALID_SIGNATURE','File contents do not match its extension.');
 await requireProject(db(),ctx,projectId);
 const key=`${randomUUID()}.${ext}`,root=resolve('.data/uploads');await mkdir(root,{recursive:true});const path=resolve(root,key);await writeFile(path,bytes,{flag:'wx'});
 try{await db().$transaction(async tx=>{
  await requireProject(tx,ctx,projectId);
  await tx.$queryRaw`SELECT "id" FROM "Project" WHERE "id"=${projectId} AND "companyId"=${ctx.companyId} FOR UPDATE`;
  const prior=await tx.document.aggregate({where:{projectId,companyId:ctx.companyId,name},_max:{version:true}});
  await tx.document.create({data:{projectId,companyId:ctx.companyId,name,version:(prior._max.version||0)+1,storageKey:key}});
 })}catch(error){await unlink(path);throw error}
 return readWorkspace(ctx);
});}
