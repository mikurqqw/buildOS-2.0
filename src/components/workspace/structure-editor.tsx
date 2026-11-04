'use client';
import {useState} from 'react';
import type {Project} from '@/modules/shared/types';
import {type Language,translate} from '@/lib/i18n';
import {copy} from './copy';
import {ProjectTree} from './project-tree';
export function StructureEditor({project,language,editable,busy,onSave}:{project:Project;language:Language;editable:boolean;busy:boolean;onSave:(action:string,p:Record<string,string>)=>Promise<unknown>}){
 const [kind,setKind]=useState('building');
 return <><p className="structure-help">{copy(language,'Это фактическая структура вашего объекта. Добавьте блок, затем его этажи и зоны.','Бұл нысаныңыздың нақты құрылымы. Блок, қабат және аймақ қосыңыз.','This is your site structure. Add a building, then floors and zones.')}</p>{!project.buildings.length?<div className="empty"><h3>{project.name}</h3><h3>{copy(language,'Структура пока не создана','Құрылым әлі жасалмаған','No structure yet')}</h3><p>{copy(language,'Здесь появятся только добавленные вами блоки и этажи.','Тек өзіңіз қосқан блоктар мен қабаттар көрсетіледі.','Only buildings and floors you add will appear here.')}</p></div>:<ProjectTree project={project} language={language}/>}
 {editable&&<form className="structure-form" key={kind} onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;await onSave(kind,Object.fromEntries(new FormData(form)) as Record<string,string>)}}><label>{copy(language,'Добавить','Қосу','Add')}<select value={kind} onChange={e=>setKind(e.target.value)}><option value="building">{copy(language,'Блок / корпус','Блок / ғимарат','Building')}</option><option value="floor">{copy(language,'Этаж','Қабат','Floor')}</option><option value="zone">{translate('Zone',language)}</option></select></label>
 {kind==='floor'&&<label>{copy(language,'В какой блок','Қай блокқа','Building')}<select name="buildingId" required><option value="">—</option>{project.buildings.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>}
 {kind==='zone'&&<label>{copy(language,'На каком этаже','Қай қабатта','Floor')}<select name="floorId" required><option value="">—</option>{project.buildings.flatMap(b=>b.floors.map(f=><option key={f.id} value={f.id}>{b.name} · {f.level}</option>))}</select></label>}
 <label>{kind==='floor'?copy(language,'Номер этажа','Қабат нөмірі','Floor number'):translate('Name',language)}<input name={kind==='floor'?'level':'name'} type={kind==='floor'?'number':'text'} min={-99} max={200} maxLength={200} required/></label><button className="primary" disabled={busy}>{copy(language,'Добавить в структуру','Құрылымға қосу','Add to structure')}</button></form>}</>;
}
