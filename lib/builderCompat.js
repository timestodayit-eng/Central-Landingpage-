const KNOWN = new Set([
  'heading','text','button','image','video','youtube','divider','spacer',
  'form','html','custom','code','innersection','stickyCallBar'
]);

function id(prefix='item'){
  return `${prefix}-${Math.random().toString(36).slice(2,10)}`;
}
function clone(v){ return JSON.parse(JSON.stringify(v)); }

export function normalizeElement(input){
  if (!input || typeof input !== 'object') {
    return {id:id('text'), type:'text', settings:{}, content:String(input ?? '')};
  }
  const e = clone(input);
  e.id = e.id || id(e.type || 'element');
  e.settings = (e.settings && typeof e.settings === 'object') ? e.settings : {};
  const alias = {
    h1:'heading', h2:'heading', paragraph:'text', richtext:'text',
    link:'button', cta:'button', img:'image', youtubeVideo:'youtube',
    youtube_video:'youtube', mp4:'video', rawhtml:'html', raw:'custom',
    innerSection:'innersection', sticky_call_bar:'stickyCallBar'
  };
  e.type = alias[e.type] || e.type || 'text';
  if (e.type === 'heading' || e.type === 'text') {
    if (e.content == null && e.text != null) e.content = e.text;
    if (typeof e.content === 'object') e.content = e.content.text ?? e.content.value ?? JSON.stringify(e.content);
  }
  if (e.type === 'button') {
    e.text = e.text ?? e.content?.text ?? e.content ?? e.settings.label ?? 'Button';
    e.url = e.url ?? e.content?.url ?? e.settings.url ?? '#';
  }
  if (e.type === 'image') {
    e.src = e.src ?? e.url ?? e.content?.url ?? e.settings.src ?? '';
    e.alt = e.alt ?? e.content?.alt ?? e.settings.alt ?? '';
  }
  if (e.type === 'youtube') {
    const c = (e.content && typeof e.content === 'object') ? e.content : {};
    e.content = {
      ...c,
      videoId: c.videoId ?? e.videoId ?? e.settings.videoId ?? '',
      url: c.url ?? e.url ?? e.videoUrl ?? e.settings.videoUrl ?? (typeof input.content === 'string' ? input.content : ''),
      embedUrl: c.embedUrl ?? e.embedUrl ?? '',
      title: c.title ?? e.title ?? 'YouTube video'
    };
    if (e.settings.mute == null && e.settings.muted != null) e.settings.mute = !!e.settings.muted;
    if (e.settings.playsinline == null && e.settings.playsInline != null) e.settings.playsinline = !!e.settings.playsInline;
  }
  if (e.type === 'video') {
    e.videoUrl = e.videoUrl ?? e.url ?? e.content?.url ?? e.settings.videoUrl ?? (typeof e.content === 'string' ? e.content : '');
    if (e.settings.muted == null && e.settings.mute != null) e.settings.muted = !!e.settings.mute;
    if (e.settings.controls == null && e.settings.showControls != null) e.settings.controls = !!e.settings.showControls;
  }
  if (e.type === 'form') {
    if (!Array.isArray(e.settings.fields) && Array.isArray(e.fields)) e.settings.fields = e.fields;
    if (!Array.isArray(e.settings.fields)) e.settings.fields = [];
  }
  if (!KNOWN.has(e.type)) {
    return {
      id:e.id,
      type:'custom',
      title:e.title || `Imported ${e.type} block`,
      settings:e.settings || {},
      html:'', css:'', js:'',
      content:{
        html:`<div data-imported-block="${String(e.type).replace(/"/g,'&quot;')}"></div>`,
        css:'', js:'', original:e
      },
      _originalType:e.type
    };
  }
  return e;
}

export function normalizeColumn(input){
  const c = (input && typeof input === 'object') ? clone(input) : {};
  c.id = c.id || id('column');
  c.width = Number(c.width) || 100;
  c.settings = (c.settings && typeof c.settings === 'object') ? c.settings : {};
  c.elements = Array.isArray(c.elements) ? c.elements.map(normalizeElement) : [];
  return c;
}

export function normalizeSection(input){
  if (!input || typeof input !== 'object') return null;
  if (input.type !== 'section' && !input.columns) {
    return {
      id:id('section'), type:'section', title:input.title || 'Imported section', settings:{},
      columns:[normalizeColumn({width:100, elements:[input]})]
    };
  }
  const s = clone(input);
  s.id = s.id || id('section');
  s.type = 'section';
  s.title = s.title || 'Untitled section';
  s.settings = (s.settings && typeof s.settings === 'object') ? s.settings : {};
  if (!Array.isArray(s.columns)) {
    const elements = Array.isArray(s.elements) ? s.elements : [];
    s.columns = [normalizeColumn({width:100, elements})];
    delete s.elements;
  } else {
    s.columns = s.columns.map(normalizeColumn);
  }
  return s;
}

export function normalizeBuilderJson(raw){
  let data = raw;
  if (typeof data === 'string') data = JSON.parse(data);
  if (Array.isArray(data)) return data.map(normalizeSection).filter(Boolean);
  if (data && Array.isArray(data.sections)) return data.sections.map(normalizeSection).filter(Boolean);
  if (data && Array.isArray(data.blocks)) return data.blocks.map(normalizeSection).filter(Boolean);
  if (data && typeof data === 'object') return [normalizeSection(data)].filter(Boolean);
  throw new Error('Unsupported JSON root. Expected array, {sections:[]}, {blocks:[]}, or a section object.');
}

export function validateAndNormalizeBuilderJson(raw){
  try {
    const sections = normalizeBuilderJson(raw);
    if (!sections.length) return {ok:false, error:'No importable sections found.', sections:[]};
    return {ok:true, sections, warnings:[]};
  } catch (err) {
    return {ok:false, error:err?.message || 'Invalid JSON', sections:[]};
  }
}
