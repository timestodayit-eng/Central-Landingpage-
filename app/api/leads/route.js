import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {query} from '@/lib/db';

export async function POST(req){
  const b=await req.json();
  const name=b.name||''; const phone=b.phone||''; const pageSlug=b.pageSlug||''; const formId=b.formId||'';
  await query(`INSERT INTO leads(page_slug,form_id,name,phone,payload_json,created_at) VALUES(?,?,?,?,?,NOW())`,[pageSlug,formId,name,phone,JSON.stringify(b)]);
  return NextResponse.json({ok:true},{status:201});
}
export async function GET(){
  const jar=await cookies();
  const expected=process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PASSWORD || '';
  if(!expected || jar.get('lcms_admin')?.value!==expected) return NextResponse.json({error:'Unauthorized'},{status:401});
  const rows=await query('SELECT * FROM leads ORDER BY id DESC LIMIT 500');
  return NextResponse.json(rows);
}
