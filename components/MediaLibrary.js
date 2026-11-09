'use client';
import { useEffect,useRef,useState } from 'react';

export default function MediaLibrary(){
  const [items,setItems]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState('');
  const inputRef=useRef(null);
  async function load(){const r=await fetch('/api/media',{cache:'no-store'});const d=await r.json();if(r.ok)setItems(d.items||[]);else setError(d.error||'Could not load media')}
  useEffect(()=>{load()},[]);
  async function upload(file){if(!file)return;setLoading(true);setError('');try{const fd=new FormData();fd.append('file',file);const r=await fetch('/api/media',{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw new Error(d.error||'Upload failed');await load()}catch(e){setError(e.message)}finally{setLoading(false);if(inputRef.current)inputRef.current.value=''}}
  async function remove(id){if(!confirm('Delete this image from the media library? Pages using it will show a broken image.'))return;const r=await fetch(`/api/media/${id}`,{method:'DELETE'});if(r.ok)load();else{const d=await r.json();alert(d.error||'Delete failed')}}
  return <div>
    <div className="card"><h2>Upload image</h2><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>upload(e.target.files?.[0])}/>{loading&&<p>Uploading...</p>}<p className="muted small">JPG, PNG, WEBP or GIF, maximum 4 MB.</p>{error&&<p className="danger-text">{error}</p>}</div>
    <div className="media-library-grid">{items.map(x=><div className="card media-card" key={x.id}><img src={x.url} alt={x.original_name||''}/><strong>{x.original_name}</strong><code>{x.url}</code><div className="row"><button className="btn ghost" onClick={()=>navigator.clipboard?.writeText(location.origin+x.url)}>Copy URL</button><button className="btn danger" onClick={()=>remove(x.id)}>Delete</button></div></div>)}</div>
  </div>
}
