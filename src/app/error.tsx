'use client';
import {useEffect,useState} from 'react';
import {translate,type Language} from '@/lib/i18n';
export default function ErrorScreen({reset}:{error:Error&{digest?:string};reset:()=>void}){
 const [language,setLanguage]=useState<Language>('ru');
 useEffect(()=>{const value=localStorage.getItem('buildos-language');if(value==='ru'||value==='kk'||value==='en')setLanguage(value)},[]);
 return <main className="form-card"><h1>{translate('An unexpected server error occurred.',language)}</h1><p className="muted">{translate('Request failed',language)}</p><button className="primary" onClick={reset}>{translate('Retry',language)}</button></main>;
}
