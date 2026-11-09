// Optional visual properties. Undefined settings preserve legacy appearances.
const n=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
export function visualStyle(s={}){
  const out={};
  const kind=s.visualBackground||'none';
  if(kind==='gradient')out.background=`linear-gradient(${n(s.gradientAngle,135)}deg, ${s.gradientFrom||'#fff4eb'}, ${s.gradientTo||'#ffb89c'})`;
  else if(kind==='glass')out.background=s.glassTint||'rgba(255,255,255,.32)';
  else if(kind==='image'&&s.visualBackgroundImage)out.backgroundImage=`url(${JSON.stringify(s.visualBackgroundImage).slice(1,-1)})`;
  if(kind==='image'&&s.visualBackgroundImage){out.backgroundSize=s.visualBackgroundSize||'cover';out.backgroundPosition=s.visualBackgroundPosition||'center';}
  if(s.glassBlur!==undefined && (kind==='glass'||s.glassBlur>0)){out.backdropFilter=`blur(${Math.max(0,n(s.glassBlur,14))}px) saturate(140%)`;out.WebkitBackdropFilter=out.backdropFilter;}
  if(s.visualBorderWidth!==undefined)out.border=`${Math.max(0,n(s.visualBorderWidth))}px solid ${s.visualBorderColor||'rgba(255,255,255,.55)'}`;
  if(s.visualRadius!==undefined)out.borderRadius=`${Math.max(0,n(s.visualRadius))}px`;
  if(s.visualOpacity!==undefined)out.opacity=Math.max(0,Math.min(100,n(s.visualOpacity,100)))/100;
  if(s.visualShadow==='soft')out.boxShadow='0 12px 32px rgba(32,42,58,.10)';
  if(s.visualShadow==='medium')out.boxShadow='0 18px 48px rgba(32,42,58,.18)';
  if(s.visualShadow==='large')out.boxShadow='0 28px 70px rgba(32,42,58,.24)';
  if(s.visualShadow==='custom')out.boxShadow=`${n(s.shadowX)}px ${n(s.shadowY,16)}px ${Math.max(0,n(s.shadowBlur,30))}px ${s.shadowColor||'rgba(32,42,58,.16)'}`;
  if(s.visualTransformRotate!==undefined)out.transform=`rotate(${n(s.visualTransformRotate)}deg)`;
  if(s.visualHover && s.visualHover!=='none'){
    out['--lc-hover-y']=`${n(s.visualHoverDistance,6)}px`;
    out['--lc-hover-scale']=String(n(s.visualHoverScale,1.03));
  }
  if(s.visualTransitionMs!==undefined)out.transitionDuration=`${Math.max(0,n(s.visualTransitionMs,260))}ms`;
  return out;
}
export function visualClass(s={}){return s.visualHover&&s.visualHover!=='none'?`lc-visual-hover lc-hover-${s.visualHover}`:''}
