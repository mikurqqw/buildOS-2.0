import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma=new PrismaClient();
const companies=[
 {id:'10000000-0000-4000-8000-000000000001',name:'Build Group',bin:'990000000001'},
 {id:'10000000-0000-4000-8000-000000000002',name:'Isolation Demo Company',bin:'990000000002'},
];
async function main(){
 for(const company of companies){
  await prisma.company.upsert({where:{id:company.id},create:company,update:{}});
  for(const [role,name] of [['DIRECTOR','Alex Morgan'],['PROJECT_MANAGER','Aigerim K.'],['FOREMAN','Askar T.'],['PTO','Daniyar S.'],['PROCUREMENT','Dana R.'],['ACCOUNTANT','Aliya B.']] as const){
   const email=`${role.toLowerCase()}@${company.id.endsWith('1')?'buildgroup':'isolation'}.demo`;
   await prisma.user.upsert({where:{companyId_email:{companyId:company.id,email}},create:{id:randomUUID(),companyId:company.id,email,name,role},update:{}});
  }
 }
 await prisma.tender.upsert({where:{id:'20000000-0000-4000-8000-000000000001'},create:{id:'20000000-0000-4000-8000-000000000001',companyId:companies[0].id,title:'Residential Complex Alatau Residence',clientName:'Alatau Development',estimatedBudget:'8500000000',documentName:'alatau-demo-specification.pdf'},update:{}});
 await prisma.tender.upsert({where:{id:'20000000-0000-4000-8000-000000000002'},create:{id:'20000000-0000-4000-8000-000000000002',companyId:companies[1].id,title:'Private isolation test tender',clientName:'Other company',estimatedBudget:'1000000'},update:{}});
 console.log('Seed ready: two companies, six roles each, one tender each. Existing data was preserved.');
}
main().catch(()=>{console.error('Seed failed. Check DATABASE_URL, PostgreSQL and migrations.');process.exitCode=1;}).finally(()=>prisma.$disconnect());
