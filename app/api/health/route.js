import {NextResponse} from 'next/server';
import {query} from '@/lib/db';
export async function GET(){try{await query('SELECT 1 ok');return NextResponse.json({ok:true,app:'Landing CMS Pro v5 Complete',database:true});}catch(e){return NextResponse.json({ok:false,database:false,error:e.message},{status:500});}}
