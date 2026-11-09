import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../../lib/admin-auth';
import { getDb } from '../../../../lib/db';

export const runtime='nodejs';
export async function DELETE(req,{params}){
  if(!getAdminSession()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const db=getDb();
    await db.query('DELETE FROM media WHERE id=?',[params.id]);
    return NextResponse.json({success:true});
  }catch(e){return NextResponse.json({error:e.message},{status:500})}
}
