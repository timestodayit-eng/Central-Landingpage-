import SettingsForm from '../../../components/SettingsForm';import { getDb } from '../../../lib/db';
export const dynamic='force-dynamic';
export default async function Settings(){
  const db=getDb();
  const [rows]=await db.query("SELECT setting_key,setting_value FROM settings WHERE setting_key IN ('site_title','site_name','meta_description','favicon_url','site_logo_url','gtm_input','meta_pixel_id','ga4_id','global_head_code','global_body_start_code','global_body_end_code','header_enabled','header_html','header_css','footer_enabled','footer_sticky','footer_html','footer_css')");
  const initial=Object.fromEntries(rows.map(r=>[r.setting_key,r.setting_value||'']));
  return <div><div className="topbar"><div><h1>Site Settings</h1><p className="muted">Site identity, header, footer, tracking and invisible code.</p></div></div><SettingsForm initial={initial}/></div>;
}
