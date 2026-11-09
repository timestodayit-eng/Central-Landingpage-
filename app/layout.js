import './globals.css';
import './visual-effects.css';
import { unstable_noStore as noStore } from 'next/cache';
import { getDb } from '../lib/db';

const FALLBACK = {
  site_title: process.env.SITE_TITLE || 'Landing CMS Pro',
  site_name: process.env.SITE_NAME || process.env.SITE_TITLE || 'Landing CMS Pro',
  meta_description: process.env.SITE_DESCRIPTION || 'Landing Page CMS',
  favicon_url: process.env.SITE_FAVICON || '/favicon.ico',
  site_logo_url: process.env.SITE_LOGO || ''
};

async function getSiteIdentity(){
  noStore();
  const identity={...FALLBACK};
  try{
    const db=getDb();
    const [rows]=await db.query(
      "SELECT setting_key,setting_value FROM settings WHERE setting_key IN ('site_title','site_name','meta_description','favicon_url','site_logo_url')"
    );
    for(const row of rows){
      if(row.setting_value) identity[row.setting_key]=row.setting_value;
    }
  }catch(error){
    console.error('Site identity load failed:',error.message);
  }
  return identity;
}

export async function generateMetadata(){
  const s=await getSiteIdentity();
  const images=s.site_logo_url?[s.site_logo_url]:undefined;
  return {
    title:s.site_title,
    description:s.meta_description,
    applicationName:s.site_name,
    icons:{icon:s.favicon_url||'/favicon.ico',shortcut:s.favicon_url||'/favicon.ico'},
    openGraph:{
      title:s.site_title,
      description:s.meta_description,
      siteName:s.site_name,
      images
    }
  };
}

export default function RootLayout({children}){
  return <html lang="en"><body>{children}</body></html>;
}
