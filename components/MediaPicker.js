'use client';
import { useEffect, useRef, useState } from 'react';

export default function MediaPicker({value='',onSelect}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const inputRef=useRef(null);

  async function load(){
    try{
      const r=await fetch('/api/media',{cache:'no-store'});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||'Could not load media.');
      setItems(d.items||[]);
    }catch(e){setError(e.message)}
  }
  useEffect(()=>{load()},[]);

  async function upload(file){
    if(!file)return;
    setError('');setLoading(true);
    try{
      const fd=new FormData();fd.append('file',file);
      const r=await fetch('/api/media',{method:'POST',body:fd});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||'Upload failed');
      onSelect?.(d.url);
      await load();
    }catch(e){setError(e.message)}finally{setLoading(false);if(inputRef.current)inputRef.current.value=''}
  }

  return <div className="media-picker">
    <div className="row">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>upload(e.target.files?.[0])}/>
      {loading&&<span className="muted small">Uploading...</span>}
    </div>
    <div className="notice" style={{marginTop:8}}>Upload JPG, PNG, WEBP or GIF up to 4 MB. Images are stored in your MySQL database, so they remain available after redeploy.</div>
    {error&&<div className="danger-text" style={{marginTop:8}}>{error}</div>}
    {value&&<div className="media-current"><span className="muted small">Selected image</span><img src={value} alt="Selected"/></div>}
    <div className="media-grid">
      {items.map(item=><button type="button" key={item.id} className={`media-thumb ${value===item.url?'selected':''}`} onClick={()=>onSelect?.(item.url)} title={item.original_name}>
        <img src={item.url} alt={item.original_name||''}/><span>{item.original_name}</span>
      </button>)}
    </div>
  </div>
}
