import {endpoint} from '@/server/http/errors';
import {jsonBody} from '@/server/http/body';
import {sameOrigin,createSession} from '@/modules/company/session';
import {acceptSchema,acceptInvitation} from '@/modules/company/management';
export async function POST(request:Request){return endpoint(async()=>{
 sameOrigin(request);const input=acceptSchema.parse(await jsonBody(request,16000));
 const user=await acceptInvitation(input);await createSession(user.id);return {ok:true};
});}
