import {NextResponse} from 'next/server';
import {query} from '@/lib/db';
import {normalizeBuilderJson} from '@/lib/builderCompat';

export async function GET(){
  const rows=await query(`SELECT p.id,p.title,p.slug,p.status,p.category_id,p.updated_at,c.name category_name FROM pages p LEFT JOIN categories c ON c.id=p.category_id ORDER BY p.updated_at DESC`);
  return NextResponse.json(rows);
}
export async function POST(req){
  const b=await req.json();
  if(!b.title||!b.slug) return NextResponse.json({error:'title and slug required'},{status:400});
  let sections=[]; try{ sections=normalizeBuilderJson(b.content_json||[]); }catch(e){ return NextResponse.json({error:e.message},{status:400}); }
  const r=await query(`INSERT INTO pages(category_id,title,slug,status,content_json,seo_title,seo_description,created_at,updated_at) VALUES(?,?,?,?,?,?,?,NOW(),NOW())`,[b.category_id||null,b.title,b.slug,b.status||'draft',JSON.stringify(sections),b.seo_title||'',b.seo_description||'']);
  return NextResponse.json({id:r.insertId},{status:201});
}
