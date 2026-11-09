import { NextResponse } from 'next/server';

export function middleware(req){
  const path=req.nextUrl.pathname;
  if(path==='/admin/login' || path==='/api/admin/login') return NextResponse.next();
  const protectedPath=path.startsWith('/admin') || path.startsWith('/api/pages') || path.startsWith('/api/categories');
  if(!protectedPath) return NextResponse.next();
  const expected=process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PASSWORD || '';
  const token=req.cookies.get('lcms_admin')?.value || '';
  if(expected && token===expected) return NextResponse.next();
  if(path.startsWith('/api/')) return NextResponse.json({error:'Unauthorized'},{status:401});
  const url=req.nextUrl.clone();url.pathname='/admin/login';return NextResponse.redirect(url);
}
export const config={matcher:['/admin/:path*','/api/pages/:path*','/api/categories/:path*','/api/admin/login']};
