import type { Role, State } from '@/modules/shared/types';
export type WorkspaceResponse={state:State;company:{id:string;name:string};storage:'postgresql'};
export class ApiClientError extends Error {
 constructor(message:string,public code:string,public requestId?:string){super(message);}
}
export async function apiRequest<T>(url:string,options:RequestInit={}):Promise<T>{
 const response=await fetch(url,{...options,cache:'no-store'});
 let body;
 try{body=await response.json()}catch{throw new ApiClientError('Invalid server response.','INVALID_RESPONSE')}
 if(!response.ok)throw new ApiClientError(body.error?.message||'Request failed',body.error?.code||'REQUEST_FAILED',body.requestId);
 return body as T;
}
export function loadWorkspace(role:Role,signal?:AbortSignal){return apiRequest<WorkspaceResponse>('/api/workspace?role='+role,{signal})}
export function sendCommand(role:Role,action:string,payload:Record<string,string>){return apiRequest<WorkspaceResponse>('/api/workspace/commands',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role,action,payload})})}
export function askAssistant(input:{role:Role;question:string;projectId:string;language:string}){return apiRequest<{answer:string;mocked:boolean}>('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)})}
