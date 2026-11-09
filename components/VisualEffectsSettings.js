export default function VisualEffectsSettings({settings={},setValue}){
  const s=settings;
  const field=(label,key,placeholder='')=><div style={{marginTop:9}}><label className="label">{label}</label><input className="input" value={s[key]??''} placeholder={placeholder} onChange={e=>setValue(key,e.target.value)}/></div>;
  const range=(label,key,min,max,step=1,initial=0)=><div style={{marginTop:9}}><label className="label">{label}: {s[key]??initial}</label><input className="range" type="range" min={min} max={max} step={step} value={s[key]??initial} onChange={e=>setValue(key,Number(e.target.value))}/></div>;
  const color=(label,key,initial)=><div style={{marginTop:9}}><label className="label">{label}</label><input className="input" value={s[key]??initial} onChange={e=>setValue(key,e.target.value)}/></div>;
  return <details className="settings-details"><summary>✨ Advanced Visual Effects</summary><p className="muted small">Optional per-section, column or element styling. Existing pages keep their original design.</p>
    <label className="label">Background effect</label><select className="select" value={s.visualBackground||'none'} onChange={e=>setValue('visualBackground',e.target.value)}><option value="none">Use existing background</option><option value="glass">Frosted glass</option><option value="gradient">Gradient</option><option value="image">Background image</option></select>
    {s.visualBackground==='glass'&&<>{color('Glass tint (CSS color)','glassTint','rgba(255,255,255,.32)')}{range('Glass blur','glassBlur',0,50,1,14)}</>}
    {s.visualBackground==='gradient'&&<>{color('Gradient start','gradientFrom','#fff4eb')}{color('Gradient end','gradientTo','#ffb89c')}{range('Gradient direction','gradientAngle',0,360,1,135)}</>}
    {s.visualBackground==='image'&&<>{field('Background image URL','visualBackgroundImage','https://...')}<label className="label">Image size</label><select className="select" value={s.visualBackgroundSize||'cover'} onChange={e=>setValue('visualBackgroundSize',e.target.value)}><option value="cover">Cover</option><option value="contain">Contain</option></select></>}
    <label className="label">Shadow</label><select className="select" value={s.visualShadow||'none'} onChange={e=>setValue('visualShadow',e.target.value)}><option value="none">None</option><option value="soft">Soft</option><option value="medium">Medium</option><option value="large">Large</option><option value="custom">Custom</option></select>
    {s.visualShadow==='custom'&&<>{range('Shadow X','shadowX',-40,40,1,0)}{range('Shadow Y','shadowY',-40,60,1,16)}{range('Shadow blur','shadowBlur',0,100,1,30)}{color('Shadow color','shadowColor','rgba(32,42,58,.16)')}</>}
    {range('Border width','visualBorderWidth',0,12,1,0)}{color('Border color','visualBorderColor','rgba(255,255,255,.55)')}
    {range('Corner radius','visualRadius',0,100,1,16)}{range('Opacity %','visualOpacity',0,100,1,100)}
    <label className="label">Hover effect</label><select className="select" value={s.visualHover||'none'} onChange={e=>setValue('visualHover',e.target.value)}><option value="none">None</option><option value="lift">Float / Lift</option><option value="scale">Zoom</option><option value="glow">Glow</option></select>
    {s.visualHover&&s.visualHover!=='none'&&<>{range('Lift distance','visualHoverDistance',0,30,1,6)}{range('Scale factor','visualHoverScale',1,1.2,.01,1.03)}</>}
    {range('Transition (ms)','visualTransitionMs',0,1200,20,260)}
    <p className="muted small">To remove an effect, choose None / Use existing background.</p>
  </details>
}
