'use client';
import {useEffect,useRef,useState} from 'react';
import {Send,Sparkles} from 'lucide-react';
import {askAssistant} from '@/modules/workspace/client';
import {type Language,translate} from '@/lib/i18n';
import type {Project,Role} from '@/modules/shared/types';
import {copy} from './copy';
type Message={id:string;type:'user'|'assistant'|'error';text:string};
export function ProjectChat({project,language,role}:{project?:Project;language:Language;role:Role}){
 const [messages,setMessages]=useState<Message[]>([]),[text,setText]=useState(''),[busy,setBusy]=useState(false);
 const bottom=useRef<HTMLDivElement>(null);
 useEffect(()=>{setMessages([]);setText('')},[project?.id,language]);
 useEffect(()=>{bottom.current?.scrollIntoView({block:'nearest'})},[messages,busy]);
 async function send(){if(!project||busy||!text.trim())return;const question=text.trim();setText('');setBusy(true);setMessages(m=>[...m,{id:crypto.randomUUID(),type:'user',text:question}]);try{const reply=await askAssistant({projectId:project.id,role,language,question});setMessages(m=>[...m,{id:crypto.randomUUID(),type:'assistant',text:reply.answer}])}catch(e){setMessages(m=>[...m,{id:crypto.randomUUID(),type:'error',text:translate(e instanceof Error?e.message:'Request failed',language)}])}finally{setBusy(false)}}
 return <section className="card project-chat"><div className="section-title"><h2><Sparkles size={20}/> {translate('BuildOS Assistant',language)}</h2><span className="badge">{project?.name||translate('No project selected',language)}</span></div><div className="chat-messages" role="log" aria-live="polite">{!messages.length&&<div className="chat-welcome"><Sparkles size={32}/><h3>{copy(language,'Давайте разберёмся вместе','Бірге талқылайық','Let’s work it out together')}</h3><p>{project?copy(language,'Напишите вопрос о задачах, дефектах или рисках проекта.','Жобаның тапсырмалары, ақаулары немесе тәуекелдері туралы сұраңыз.','Ask about tasks, site issues or project risks.'):translate('No project selected',language)}</p></div>}{messages.map(m=><div key={m.id} className={`chat-message ${m.type}`}><small>{m.type==='user'?copy(language,'Вы','Сіз','You'):'BuildOS'}</small><p>{m.text}</p></div>)}{busy&&<p role="status">{translate('Loading BuildOS…',language)}</p>}<div ref={bottom}/></div><form className="chat-composer" onSubmit={e=>{e.preventDefault();send()}}><textarea aria-label={translate('Ask assistant',language)} placeholder={copy(language,'Напишите сообщение…','Хабарлама жазыңыз…','Write a message…')} value={text} onChange={e=>setText(e.target.value)} maxLength={2000} disabled={!project} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send()}}}/><button className="primary" disabled={busy||!project||!text.trim()} aria-label={translate('Ask assistant',language)}><Send size={19}/></button></form><small className="chat-disclaimer">{copy(language,'Демо-помощник. Проверяйте рекомендации перед действием.','Демо көмекші. Әрекеттен бұрын ұсынысты тексеріңіз.','Demo assistant. Review recommendations before acting.')}</small></section>;
}
