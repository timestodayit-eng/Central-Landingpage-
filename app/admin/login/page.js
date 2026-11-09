'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function Login(){
  const [password,setPassword]=useState(''); const [error,setError]=useState(''); const router=useRouter();
  async function submit(e){ e.preventDefault(); setError(''); const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})}); if(r.ok){ router.push('/admin'); router.refresh(); } else setError('Invalid password'); }
  return <main className="center-page"><form className="login-card" onSubmit={submit}><h1>Landing CMS Pro v5</h1><p>Admin Login</p><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password" className="cms-input"/><button className="primary-btn">Login</button>{error&&<div className="error">{error}</div>}</form></main>;
}
