'use client';
import {copy} from './workspace/copy';
import type {Language} from '@/lib/i18n';
type AccessProject={id:string;name:string;members:{userId:string}[]};
export function ProjectAccess({projects,users,language,busy,onChange}:{projects:AccessProject[];users:{id:string;name:string;role:string}[];language:Language;busy:boolean;onChange:(p:Record<string,string>)=>void}){
 return <section className="card form-card"><h2>{copy(language,'Доступ к проектам','Жобаларға қолжетімділік','Project access')}</h2><p className="muted">{copy(language,'Директор и бухгалтер видят все проекты. Остальным назначьте доступ ниже.','Директор мен бухгалтер барлық жобаларды көреді. Басқаларға қолжетімділік тағайындаңыз.','Directors and accountants see all projects. Assign other users below.')}</p>{!projects.length&&<p>—</p>}{projects.map(project=><fieldset key={project.id} style={{marginTop:20,padding:16,border:'1px solid var(--line)',borderRadius:8}}><legend>{project.name}</legend>{users.filter(u=>!['DIRECTOR','ACCOUNTANT'].includes(u.role)).map(user=><label key={user.id} style={{flexDirection:'row',alignItems:'center',minHeight:44}}><input type="checkbox" checked={project.members.some(m=>m.userId===user.id)} disabled={busy} onChange={e=>onChange({action:'membership',projectId:project.id,userId:user.id,enabled:String(e.target.checked)})}/>{user.name}</label>)}</fieldset>)}</section>;
}
