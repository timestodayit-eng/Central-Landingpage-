import {NextResponse} from 'next/server';
import {query} from '@/lib/db';
export async function GET(){ const rows=await query('SELECT id,name,slug,sort_order FROM categories ORDER BY sort_order,id'); return NextResponse.json(rows); }
export async function POST(req){ const b=await req.json(); if(!b.name||!b.slug) return NextResponse.json({error:'name and slug required'},{status:400}); const r=await query('INSERT INTO categories(name,slug,sort_order) VALUES(?,?,?)',[b.name,b.slug,Number(b.sort_order||0)]); return NextResponse.json({id:r.insertId},{status:201}); }
