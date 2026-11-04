'use client';
import {useEffect,useState} from 'react';
import {apiRequest} from '@/modules/workspace/client';
import {translate,type Language} from '@/lib/i18n';
export default function JoinPage(){
 const [token,setToken]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [language,setLanguage]=useState<Language>('ru');
 useEffect(()=>{setToken(location.hash.slice(1));history.replaceState(null,'','/join');const stored=localStorage.getItem('buildos-language');if(stored==='ru'||stored==='kk'||stored==='en')setLanguage(stored);if(localStorage.getItem('buildos-theme')==='dark')document.documentElement.dataset.theme='dark'},[]);
 const title=language==='kk'?'Командаға қосылу':language==='en'?'Join your team':'Присоединиться к команде';
 async function accept(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);try{
  const password=String(new FormData(e.currentTarget).get('password'));
  await apiRequest('/api/invitations/accept',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,password})});location.assign('/');
 }catch(e){setError(translate(e instanceof Error?e.message:'Request failed',language))}finally{setBusy(false)}}
 return <main className="company-management"><h1>{title}</h1><form className="card form-card" onSubmit={accept}><p className="muted">{language==='kk'?'Құпиясөз: кемінде 12 таңба.':language==='en'?'Choose a password of at least 12 characters.':'Задайте пароль от 12 символов. Приглашение действует 7 дней и используется один раз.'}</p><label>{language==='en'?'Password':language==='kk'?'Құпиясөз':'Пароль'}<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required/></label>{error&&<p role="alert" className="notice">{error}</p>}<button className="primary" disabled={busy||!token}>{title}</button></form><a href="/">BuildOS →</a></main>;
}
