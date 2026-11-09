'use client';
import React, {useState} from 'react';
import { extractYouTubeId } from '@/lib/content';
import { normalizeElement, normalizeSection } from '@/lib/builderCompat';

function px(v){ return v===undefined || v===null || v==='' ? undefined : `${Number(v)||0}px`; }
function box(s={}){
  return {
    background:s.backgroundColor || undefined,
    color:s.color || undefined,
    textAlign:s.align || undefined,
    paddingTop:px(s.paddingTop), paddingRight:px(s.paddingRight), paddingBottom:px(s.paddingBottom), paddingLeft:px(s.paddingLeft),
    marginTop:px(s.marginTop), marginRight:px(s.marginRight), marginBottom:px(s.marginBottom), marginLeft:px(s.marginLeft),
    borderRadius:px(s.borderRadius), boxShadow:s.boxShadow || undefined,
    maxWidth:s.maxWidth ? px(s.maxWidth) : undefined,
    width:s.width || undefined
  };
}
function aspect(s={}){
  const ar=s.aspectRatio || '16:9';
  if(typeof ar==='string' && ar.includes(':')){ const [w,h]=ar.split(':').map(Number); if(w>0&&h>0) return {aspectRatio:`${w}/${h}`}; }
  return {aspectRatio:'16/9'};
}
function youtubeSrc(e,s){
  const raw=e.content?.videoId || e.content?.url || e.content?.embedUrl || e.videoId || e.url || s.videoUrl || '';
  const id=e.content?.videoId || extractYouTubeId(raw);
  if(!id) return '';
  const p=new URLSearchParams();
  p.set('playsinline', s.playsinline===false?'0':'1');
  p.set('controls', s.controls===false?'0':'1');
  if(s.autoplay) p.set('autoplay','1');
  if(s.mute || s.muted) p.set('mute','1');
  if(s.loop){ p.set('loop','1'); p.set('playlist',id); }
  return `https://www.youtube.com/embed/${id}?${p.toString()}`;
}

function Unknown({e,preview}){
  if(!preview) return null;
  return <div className="unknown-block">Unsupported block: <b>{e.type}</b></div>;
}

function FormBlock({e,s,preview}){
  const [state,setState]=useState({busy:false,message:''});
  const fields=Array.isArray(s.fields)?s.fields:(Array.isArray(e.fields)?e.fields:[]);
  async function submit(ev){
    ev.preventDefault();
    if(preview){ setState({busy:false,message:'Preview mode: form not submitted.'}); return; }
    const form=new FormData(ev.currentTarget);
    const payload=Object.fromEntries(form.entries());
    payload.formId=s.formId || e.formId || e.id;
    payload.pageSlug=window.location.pathname.split('/').filter(Boolean).pop() || '';
    setState({busy:true,message:''});
    const res=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json().catch(()=>({}));
    setState({busy:false,message:res.ok?(s.successMessage || 'Thank you.'): (data.error || 'Submission failed')});
    if(res.ok) ev.currentTarget.reset();
  }
  return <form onSubmit={submit} style={box(s)} className={s.customClass||''}>
    {fields.map((f,i)=>{
      const key=f.name||`field-${i}`;
      const common={name:f.name,required:!!f.required,placeholder:f.placeholder||'',min:f.min,max:f.max,className:'cms-input'};
      return <label key={key} className="cms-field"><span>{f.label||f.name}</span>
        {f.type==='textarea'?<textarea {...common}/>:f.type==='select'?<select {...common}><option value="">Select</option>{(f.options||[]).map((o,n)=><option key={n} value={typeof o==='string'?o:o.value}>{typeof o==='string'?o:o.label}</option>)}</select>:<input type={f.type||'text'} {...common}/>} 
      </label>;
    })}
    <button className="cms-submit" disabled={state.busy} style={{background:s.buttonBackgroundColor||'#CE2032',color:s.buttonColor||'#fff',borderRadius:px(s.borderRadius||10)}}>{state.busy?'Sending...':(s.submitText||e.submitText||'Submit')}</button>
    {state.message && <div className="form-message">{state.message}</div>}
  </form>;
}

function Element({element,preview=false}){
  const e=normalizeElement(element); const s=e.settings||{};
  const style={...box(s),fontSize:s.fontSize?`${s.fontSize}px`:undefined,fontWeight:s.fontWeight||undefined,lineHeight:s.lineHeight||undefined};
  switch(e.type){
    case 'heading': { const Tag=s.tag||'h2'; return <Tag style={style} className={s.customClass||''}>{e.content??e.text??''}</Tag>; }
    case 'text': return <div style={{...style,whiteSpace:'pre-line'}} className={s.customClass||''}>{e.content??e.text??''}</div>;
    case 'button': return <div style={{textAlign:s.align||'left',marginBottom:px(s.marginBottom)}}><a href={e.url||'#'} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none',...style}}>{e.text??e.content??'Button'}</a></div>;
    case 'image': return <img src={e.src||e.url||e.content?.url||''} alt={e.alt||e.content?.alt||''} loading="lazy" style={{...box(s),display:'block',width:s.width||'100%',height:'auto',objectFit:s.objectFit||'cover'}}/>;
    case 'youtube': { const src=youtubeSrc(e,s); return src?<div style={{...box(s),...aspect(s)}}><iframe title={e.content?.title||'YouTube video'} src={src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{width:'100%',height:'100%',border:0,borderRadius:px(s.borderRadius)}}/></div>:<Unknown e={{type:'youtube (missing video id)'}} preview={preview}/>; }
    case 'video': { const raw=e.videoUrl||e.url||e.content?.url||e.content||s.videoUrl||''; const yid=extractYouTubeId(String(raw)); if(yid||s.videoType==='youtube') return <Element element={{...e,type:'youtube',content:{...(typeof e.content==='object'?e.content:{}),url:raw}}} preview={preview}/>; return raw?<video src={raw} poster={e.poster||s.poster||undefined} controls={s.controls!==false&&s.showControls!==false} autoPlay={!!s.autoplay} muted={!!(s.mute??s.muted)} loop={!!s.loop} playsInline={s.playsInline!==false&&s.playsinline!==false} style={{...box(s),...aspect(s),width:'100%',objectFit:s.objectFit||'cover'}}/>:<Unknown e={{type:'video (missing url)'}} preview={preview}/>; }
    case 'divider': return <hr style={{border:0,borderTop:`${s.thickness||1}px solid ${s.color||'#e5e7eb'}`,marginTop:px(s.marginTop),marginBottom:px(s.marginBottom)}}/>;
    case 'spacer': return <div style={{height:px(s.height||e.height||24)}}/>;
    case 'form': return <FormBlock e={e} s={s} preview={preview}/>;
    case 'html': case 'custom': case 'code': { const html=e.html||e.content?.html||(typeof e.content==='string'?e.content:''); const css=e.css||e.content?.css||''; const js=e.js||e.content?.js||''; const srcDoc=`<!doctype html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`; return <iframe sandbox="allow-scripts allow-forms allow-popups" srcDoc={srcDoc} style={{width:'100%',height:px(e.height||s.height||300),border:0,borderRadius:px(s.borderRadius)}}/>; }
    case 'innersection': { const cols=e.columns||e.content?.columns||[]; return <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.max(cols.length,1)},minmax(0,1fr))`,gap:px(s.gap||12),...box(s)}}>{cols.map((c,i)=><div key={c.id||i} style={box(c.settings||{})}>{(c.elements||[]).map((x,j)=><Element key={x.id||j} element={x} preview={preview}/>)}</div>)}</div>; }
    case 'stickyCallBar': return <a href={e.url||`tel:${s.phone||''}`} style={{position:s.position||'fixed',left:s.left||12,right:s.right||12,bottom:s.bottom??12,zIndex:s.zIndex||9999,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',...box(s)}}>{e.text||e.content||s.label||'Call now'}</a>;
    default: return <Unknown e={e} preview={preview}/>;
  }
}

export default function BlockRenderer({block,preview=false}){
  const b=normalizeSection(block); if(!b) return null; const s=b.settings||{}; const cols=b.columns||[];
  return <section id={b.anchor||s.idAnchor||b.id} className={s.customClass||''} style={{background:s.backgroundColor||undefined,paddingTop:px(s.paddingTop),paddingRight:px(s.paddingRight),paddingBottom:px(s.paddingBottom),paddingLeft:px(s.paddingLeft),marginTop:px(s.marginTop),marginBottom:px(s.marginBottom),borderRadius:px(s.borderRadius)}}>
    <div className="cms-section-inner" style={{maxWidth:s.contentWidth?`${s.contentWidth}px`:undefined,gap:px(s.gap||0)}}>
      {cols.map((c,i)=><div key={c.id||i} style={{...box(c.settings||{}),flexBasis:`${Number(c.width)||100}%`,flexGrow:0,flexShrink:1}}>{(c.elements||[]).map((el,j)=><Element key={el.id||j} element={el} preview={preview}/>)}</div>)}
    </div>
  </section>;
}
