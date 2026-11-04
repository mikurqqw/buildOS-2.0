import React from 'react';
import { translate, type Language } from '@/lib/i18n';

// Translate labels only: form values must remain stable server-side enum codes.
export function EnumOptions({values,language}:{values:readonly string[];language:Language}){
 return values.map(value=><option key={value} value={value}>{translate(value,language)}</option>);
}
