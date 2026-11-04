import { endpoint } from '@/server/http/errors';
import { jsonBody } from '@/server/http/body';
import { sessionContext,sameOrigin } from '@/modules/company/session';
import { aiSchema } from '@/modules/workspace/contracts';
import { answerQuestion } from '@/modules/ai/service';

export const runtime='nodejs';
export async function POST(request:Request){return endpoint(async()=>{
 sameOrigin(request);
 const input=aiSchema.parse(await jsonBody(request,16000));
 return answerQuestion(await sessionContext(),input);
});}
