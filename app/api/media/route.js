import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../lib/admin-auth';
import { getDb } from '../../../lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['image/jpeg','image/png','image/webp','image/gif']);
const MAX_BYTES = 4 * 1024 * 1024;

export async function GET(){
  if(!getAdminSession()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const db=getDb();
    const [rows]=await db.query('SELECT id,original_name,mime_type,size_bytes,created_at FROM media ORDER BY id DESC LIMIT 200');
    return NextResponse.json({items:rows.map(r=>({...r,url:`/media/${r.id}`}))});
  }catch(e){
    return NextResponse.json({error:e.message},{status:500});
  }
}

export async function POST(req){
  if(!getAdminSession()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const form=await req.formData();
    const file=form.get('file');
    if(!file || typeof file.arrayBuffer!=='function') return NextResponse.json({error:'Please choose an image file.'},{status:400});
    if(!ALLOWED.has(file.type)) return NextResponse.json({error:'Only JPG, PNG, WEBP and GIF images are allowed.'},{status:400});
    if(file.size<=0 || file.size>MAX_BYTES) return NextResponse.json({error:'Image must be 4 MB or smaller.'},{status:400});
    const buffer=Buffer.from(await file.arrayBuffer());
    const db=getDb();
    const [result]=await db.query('INSERT INTO media(original_name,mime_type,size_bytes,file_data) VALUES(?,?,?,?)',[String(file.name||'image').slice(0,255),file.type,file.size,buffer]);
    return NextResponse.json({id:result.insertId,url:`/media/${result.insertId}`,name:file.name,mime_type:file.type,size_bytes:file.size});
  }catch(e){
    return NextResponse.json({error:e.message},{status:500});
  }
}
