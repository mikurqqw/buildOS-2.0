export const roles = ['DIRECTOR','PROJECT_MANAGER','FOREMAN','PTO','PROCUREMENT','ACCOUNTANT'] as const;
export type Role = typeof roles[number];
export type Tender = {id:string;companyId:string;title:string;clientName:string;budget:number;durationMonths?:number;status:'NEW'|'ANALYSIS'|'DECISION'|'PREPARATION'|'SUBMITTED'|'WON'|'LOST';document?:string;score?:number;margin?:number;risks?:string[]};
export type Project = {id:string;companyId:string;tenderId?:string;name:string;budget:number;progress:number;status:string;buildings:{id?:string;name:string;floors:{id?:string;level:number;zones:string[]}[]}[]};
export type Task = {id:string;projectId:string;title:string;assignee:string;priority:string;status:string;dueDate:string};
export type Issue = {id:string;projectId:string;title:string;description:string;priority:string;status:string;assignee:string;category:string;imageUrl?:string;floorId?:string};
export type Risk = {id:string;projectId:string;severity:string;title:string;reason:string;impact:string;suggestion:string;isActioned:boolean};
export type State = {tenders:Tender[];projects:Project[];tasks:Task[];issues:Issue[];risks:Risk[];reports:{id:string;projectId:string;text:string;date?:string;weather?:string;labor?:string;notes?:string;author?:Role}[];requests:{id:string;projectId:string;title:string;status:string}[];documents:{id:string;projectId:string;name:string;version:number}[];users:{id:string;name:string;email:string;role:Role;status:string}[]};
