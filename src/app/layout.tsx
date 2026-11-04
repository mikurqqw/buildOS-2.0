import './globals.css';
import './themes.css';
import './workspace.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'BuildOS · Construction intelligence', description: 'AI-native operating system for general contractors' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="ru" data-theme="light"><body>{children}</body></html>}
