'use client';
import {ProjectAccess} from './project-access';
import {useEffect,useState} from 'react';
import {apiRequest} from '@/modules/workspace/client';
import {roles,type Role} from '@/modules/shared/types';
import {EnumOptions} from './enum-options';
import {type Language,translate} from '@/lib/i18n';
type Member={id:string;name:string;email:string;role:Role};
type Data={company:{name:string;bin:string;address:string|null};users:Member[];invitations:(Member&{expiresAt:string})[];projects:{id:string;name:string;members:{userId:string}[]}[];viewerId:string};
const labels={ru:['Компания и сотрудники','Название компании','Адрес','Сохранить','Пригласить по ссылке','Имя','Почта','Создать ссылку','Приглашения','Отозвать','Ссылка доступна один раз. Передайте её сотруднику лично.','Назад в BuildOS','Сохранено','БИН','Загрузка…'],kk:['Компания және қызметкерлер','Компания атауы','Мекенжай','Сақтау','Сілтеме арқылы шақыру','Аты','Пошта','Сілтеме құру','Шақырулар','Кері қайтару','Сілтеме бір рет көрсетіледі. Қызметкерге жеке жіберіңіз.','BuildOS жүйесіне оралу','Сақталды','БСН','Жүктелуде…'],en:['Company and people','Company name','Address','Save','Invite by link','Name','Email','Create link','Invitations','Revoke','This link is shown once. Share it privately with the employee.','Back to BuildOS','Saved','BIN','Loading…']};
export function CompanyManager(){
 const [language,setLanguage]=useState<Language>('ru'),[data,setData]=useState<Data>(),[error,setError]=useState(''),[busy,setBusy]=useState(false),[link,setLink]=useState('');
 const l=labels[language];
 async function refresh(){setData(await apiRequest<Data>('/api/company'))}
 useEffect(()=>{const value=localStorage.getItem('buildos-language');if(value==='ru'||value==='kk'||value==='en')setLanguage(value);const theme=localStorage.getItem('buildos-theme');if(theme==='dark')document.documentElement.dataset.theme='dark';refresh().catch(e=>setError(e.message))},[]);
 async function submit(input:Record<string,string>){setBusy(true);setError('');try{
  const result=await apiRequest<{token?:string}>('/api/company',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
  if(result.token)setLink(`${location.origin}/join#${result.token}`);await refresh();
 }catch(e){setError(e instanceof Error?e.message:'Request failed')}finally{setBusy(false)}}
 return <main className="company-management"><a href="/">← {l[11]}</a><h1>{l[0]}</h1>{error&&<p className="notice" role="alert">{translate(error,language)}</p>}{!data&&!error&&<p role="status">{l[14]}</p>}{data&&<>
 <form className="card form-card" onSubmit={e=>{e.preventDefault();submit({action:'company',...Object.fromEntries(new FormData(e.currentTarget))})}}>
 <p>{l[13]}: {data.company.bin}</p><label>{l[1]}<input name="name" defaultValue={data.company.name} required minLength={2} maxLength={200}/></label><label>{l[2]}<input name="address" defaultValue={data.company.address||''} maxLength={500}/></label><button disabled={busy} className="primary">{l[3]}</button></form>
 <section className="card form-card"><h2>{l[0]}</h2>{data.users.map(user=><div className="user-row" key={user.id}><div><h3>{user.name}</h3><p className="muted">{user.email}</p></div><select aria-label={`${translate('Role',language)}: ${user.name}`} disabled={busy||user.id===data.viewerId} value={user.role} onChange={e=>submit({action:'role',userId:user.id,role:e.target.value})}><EnumOptions values={roles} language={language}/></select></div>)}</section>
 <form className="card form-card" onSubmit={e=>{e.preventDefault();setLink('');submit({action:'invite',...Object.fromEntries(new FormData(e.currentTarget))})}}><h2>{l[4]}</h2><label>{l[5]}<input name="name" required minLength={2} maxLength={200}/></label><label>{l[6]}<input name="email" type="email" required maxLength={254}/></label><label>{translate('Role',language)}<select name="role"><EnumOptions values={roles} language={language}/></select></label><button className="primary" disabled={busy}>{l[7]}</button></form>
 {link&&<div className="card form-card"><p>{l[10]}</p><input aria-label={l[7]} readOnly value={link} onFocus={e=>e.target.select()}/></div>}
 <ProjectAccess projects={data.projects} users={data.users} language={language} busy={busy} onChange={submit}/><section className="card form-card"><h2>{l[8]}</h2>{!data.invitations.length&&<p className="muted">—</p>}{data.invitations.map(invite=><div className="user-row" key={invite.id}><div><h3>{invite.name}</h3><p>{invite.email} · {translate(invite.role,language)}</p><small>{new Date(invite.expiresAt).toLocaleDateString(language==='kk'?'kk-KZ':language)}</small></div><button className="primary" disabled={busy} onClick={()=>submit({action:'revoke',id:invite.id})}>{l[9]}</button></div>)}</section></>}
 </main>;
}
