'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

export default function AdminDashboard(){
  const [pages,setPages]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  async function load(){ setLoading(true); const r=await fetch('/api/pages',{cache:'no-store'}); const d=await r.json().catch(()=>[]); if(!r.ok)setError(d.error||'Could not load pages'); else setPages(d); setLoading(false); }
  useEffect(()=>{load()},[]);
  async function duplicate(id){ const r=await fetch(`/api/pages/${id}/duplicate`,{method:'POST'}); if(r.ok) load(); }
  async function remove(id){ if(!confirm('Delete this page?')) return; const r=await fetch(`/api/pages/${id}`,{method:'DELETE'}); if(r.ok) load(); }
  return <main className="admin-shell">
    <header className="admin-header"><div><div className="eyebrow">LANDING CMS PRO v5 COMPLETE</div><h1>Landing Pages</h1><p>Flexible JSON builder, video blocks, forms and MySQL storage.</p></div><Link className="primary-btn" href="/admin/pages/new">+ New Page</Link></header>
    {error&&<div className="error-box">{error}</div>}
    <div className="table-card"><div className="table-head"><b>Pages</b><button className="ghost-btn" onClick={load}>Refresh</button></div>{loading?<div className="empty">Loading...</div>:pages.length===0?<div className="empty">No pages yet. Create your first landing page.</div>:<div className="page-list">{pages.map(p=><div className="page-row" key={p.id}><div><b>{p.title}</b><div className="muted">/{p.slug} · {p.category_name||'Uncategorized'} · <span className={`status ${p.status}`}>{p.status}</span></div></div><div className="row-actions"><a className="ghost-btn" href={`/p/${p.slug}`} target="_blank">View</a><Link className="ghost-btn" href={`/admin/pages/${p.id}`}>Edit</Link><button className="ghost-btn" onClick={()=>duplicate(p.id)}>Duplicate</button><button className="danger-btn" onClick={()=>remove(p.id)}>Delete</button></div></div>)}</div>}</div>
    <div className="admin-grid"><a className="feature-card" href="/api/leads" target="_blank"><b>Leads API</b><span>View latest stored form submissions</span></a><div className="feature-card"><b>JSON Compatibility</b><span>Array, sections, blocks and future unknown elements supported</span></div><div className="feature-card"><b>Version History</b><span>Every page update snapshots the previous version in MySQL</span></div></div>
  </main>;
}
