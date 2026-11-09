import {NextResponse} from 'next/server';
import {validPassword,adminSessionToken} from '@/lib/auth';
export async function POST(req){ const {password}=await req.json(); if(!validPassword(password)) return NextResponse.json({error:'Invalid password'},{status:401}); const res=NextResponse.json({ok:true}); res.cookies.set('lcms_admin',adminSessionToken(),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*7}); return res; }
