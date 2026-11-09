import {notFound} from 'next/navigation';
import {query} from '@/lib/db';
import BlockRenderer from '@/components/BlockRenderer';

export const dynamic='force-dynamic';

async function getPage(slug){
  const rows=await query(`SELECT * FROM pages WHERE slug=? AND status='published' LIMIT 1`,[slug]);
  if(!rows.length) return null;
  const p=rows[0];
  try{p.content_json=typeof p.content_json==='string'?JSON.parse(p.content_json):p.content_json;}catch{p.content_json=[];}
  return p;
}

export async function generateMetadata({params}){
  const {slug}=await params; const p=await getPage(slug).catch(()=>null);
  if(!p) return {title:'Landing Page'};
  return {title:p.seo_title||p.title,description:p.seo_description||''};
}

export default async function PublicPage({params}){
  const {slug}=await params; const p=await getPage(slug); if(!p) notFound();
  return <main className="public-page">{(p.content_json||[]).map((b,i)=><BlockRenderer key={b.id||i} block={b}/>)}</main>;
}
