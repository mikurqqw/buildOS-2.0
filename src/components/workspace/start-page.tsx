import {ArrowUpRight,ClipboardList,Building2,CheckCircle2,HardHat,FileText,Users} from 'lucide-react';
import {translate,type Language} from '@/lib/i18n';
import {copy,description} from './copy';
export function StartPage({language,onNavigate,company}:{language:Language;onNavigate:(page:string)=>void;company:string}){
 const entries=[['Tenders',ClipboardList],['Projects',Building2],['Tasks',CheckCircle2],['Site operations',HardHat],['Daily reports',FileText],['Team & company',Users]] as const;
 return <><section className="welcome-panel"><span className="eyebrow">{company}</span><h2>{copy(language,'Ваш рабочий день начинается здесь','Жұмыс күніңіз осы жерден басталады','Your workday starts here')}</h2><p>{copy(language,'От нового тендера до готового объекта — всё под рукой.','Жаңа тендерден дайын нысанға дейін — бәрі қолыңызда.','From the first bid to the finished site — everything within reach.')}</p><button className="primary" onClick={()=>onNavigate('Overview')}>{translate('Overview',language)} <ArrowUpRight size={18}/></button></section><div className="start-grid">{entries.map(([page,Icon])=><button className="start-card card" key={page} onClick={()=>onNavigate(page)}><Icon size={23}/><h3>{translate(page,language)}</h3><p>{description(page,language)}</p><ArrowUpRight size={18}/></button>)}</div></>;
}
