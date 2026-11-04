import { endpoint } from '@/server/http/errors';
import { jsonBody } from '@/server/http/body';
import { sessionContext,sameOrigin } from '@/modules/company/session';
import { commandSchema } from '@/modules/workspace/contracts';
import { execute } from '@/modules/workspace/service';
import { readWorkspace } from '@/modules/workspace/repository';

export const runtime='nodejs';
export async function POST(request:Request){return endpoint(async()=>{
 sameOrigin(request);
 const input=commandSchema.parse(await jsonBody(request));
 const ctx=await sessionContext();
 await execute(ctx,input);
 return readWorkspace(ctx);
});}
