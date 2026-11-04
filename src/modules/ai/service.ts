import { db } from '@/server/db';
import type { TenantContext } from '@/modules/company/context';
import { requireProject } from '@/modules/projects/repository';
import type { z } from 'zod';
import type { aiSchema } from '@/modules/workspace/contracts';

export async function answerQuestion(ctx:TenantContext,input:z.infer<typeof aiSchema>){
 const restricted=/budget|margin|cash|financial|бюджет|марж|финанс|ақша|қаржы/i.test(input.question)&&!['DIRECTOR','ACCOUNTANT'].includes(ctx.role);
 const snapshot=await db().$transaction(async tx=>{
  const project=await requireProject(tx,ctx,input.projectId);
  const where={companyId:ctx.companyId,projectId:project.id};
  const today=new Date();today.setUTCHours(0,0,0,0);
  const [issues,tasks,risk,requests]=await Promise.all([
   tx.issue.count({where:{...where,status:{notIn:['RESOLVED','CLOSED']}}}),
   tx.task.count({where:{...where,status:{not:'DONE'},dueDate:{lt:today}}}),
   tx.aiRiskAlert.findFirst({where:{...where,isActioned:false},orderBy:{createdAt:'asc'}}),
   tx.purchaseRequest.count({where:{...where,status:'PENDING_APPROVAL'}}),
  ]);
  return {project,issues,tasks,risk,requests};
 });
 const {project,issues,tasks,risk,requests}=snapshot;
 const answers={
  ru:restricted?'Финансовая информация недоступна для вашей роли в демо.':`Проект ${project.name}. ${risk?'Есть открытая рекомендация: проверьте закупку материалов фасада блока А. Демо-прогноз задержки — 7 дней.':'Открытых AI-рекомендаций по закупке нет.'} Открытых дефектов: ${issues}, просроченных задач: ${tasks}, заявок на согласовании: ${requests}. Данные прочитаны из PostgreSQL; AI-выводы имитируются.`,
  kk:restricted?'Демодағы рөліңіз үшін қаржылық ақпарат қолжетімсіз.':`${project.name} жобасы. ${risk?'Ашық ұсыныс бар: А блогының қасбет материалдарын сатып алуды тексеріңіз. Демо кідіріс болжамы — 7 күн.':'Сатып алу бойынша ашық ЖИ ұсыныстары жоқ.'} Ашық ақаулар: ${issues}, мерзімі өткен тапсырмалар: ${tasks}, мақұлдауды күткен өтінімдер: ${requests}. Деректер PostgreSQL базасынан алынды; ЖИ қорытындылары имитацияланған.`,
  en:restricted?'Financial information is restricted for your current demo role.':`Project ${project.name}. ${risk?'An open recommendation needs review: check façade procurement for Block A. Demo schedule slip estimate: 7 days.':'No open AI procurement recommendations.'} Open issues: ${issues}, overdue tasks: ${tasks}, requests awaiting approval: ${requests}. Data was read from PostgreSQL; AI conclusions are mocked.`,
 };
 return {answer:answers[input.language],mocked:true};
}
