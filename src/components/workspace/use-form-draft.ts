'use client';
import {useEffect,useRef,useState} from 'react';
export function useFormDraft(key:string,enabled:boolean){
 const ref=useRef<HTMLFormElement>(null),[offline,setOffline]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const form=ref.current;if(!form||!enabled)return;
  const update=()=>setOffline(!navigator.onLine);update();
  try{const stored=localStorage.getItem(key);if(stored){const fields:unknown=JSON.parse(stored);if(fields&&typeof fields==='object')for(const [name,value] of Object.entries(fields)){const input=form.elements.namedItem(name);if((input instanceof HTMLInputElement||input instanceof HTMLTextAreaElement||input instanceof HTMLSelectElement)&&typeof value==='string'&&input.type!=='file')input.value=value}}}catch{setFailed(true)}
  const save=()=>{try{const data:Record<string,string>={};for(const [name,value] of new FormData(form)){if(typeof value==='string')data[name]=value}localStorage.setItem(key,JSON.stringify(data))}catch{setFailed(true)}};
  form.addEventListener('input',save);form.addEventListener('change',save);addEventListener('offline',update);addEventListener('online',update);
  return()=>{form.removeEventListener('input',save);form.removeEventListener('change',save);removeEventListener('offline',update);removeEventListener('online',update)};
 },[key,enabled]);
 const clear=()=>{try{localStorage.removeItem(key)}catch{setFailed(true)}};
 return {ref,offline,failed,clear};
}
