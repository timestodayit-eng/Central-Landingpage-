import { getDb } from '../../../lib/db';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(req,{params}){
  try{
    const db=getDb();
    const [rows]=await db.query('SELECT mime_type,file_data FROM media WHERE id=? LIMIT 1',[params.id]);
    if(!rows[0]) return new Response('Not found',{status:404});
    return new Response(rows[0].file_data,{status:200,headers:{'Content-Type':rows[0].mime_type,'Cache-Control':'public, max-age=31536000, immutable'}});
  }catch(e){return new Response('Image unavailable',{status:500})}
}
