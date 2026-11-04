import { endpoint } from '@/server/http/errors';
import { sessionContext,sameOrigin } from '@/modules/company/session';
import { workspaceQuery } from '@/modules/workspace/contracts';
import { readWorkspace } from '@/modules/workspace/repository';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request){return endpoint(async()=>{
 const input=workspaceQuery.parse(Object.fromEntries(new URL(request.url).searchParams));
 return readWorkspace(await sessionContext());
});}
