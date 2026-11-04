import {Building2,Layers,MapPin} from 'lucide-react';
import type {Project} from '@/modules/shared/types';
import {type Language,translate} from '@/lib/i18n';
import {copy} from './copy';
export function ProjectTree({project,language}:{project:Project;language:Language}){
 return <div className="project-structure"><div className="structure-root"><Building2/><div><h3>{project.name}</h3><p>{project.buildings.length} {copy(language,'блоков','блок','blocks')}</p></div></div>{project.buildings.map((block,i)=><details className="structure-block" key={`${block.name}-${i}`} open><summary><Building2 size={18}/>{translate(block.name,language)}<span>{block.floors.length} {copy(language,'этажей','қабат','floors')}</span></summary><div className="floor-grid">{block.floors.map(floor=><div className="floor-card" key={floor.level}><h4><Layers size={17}/>{copy(language,'Этаж','Қабат','Floor')} {floor.level}</h4><div>{floor.zones.map(zone=><span className="zone-pill" key={zone}><MapPin size={12}/>{translate(zone,language)}</span>)}</div></div>)}</div></details>)}</div>;
}
