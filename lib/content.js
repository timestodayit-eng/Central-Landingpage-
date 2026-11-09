export function extractYouTubeId(value=''){
  const s = String(value || '').trim();
  if (/^[A-Za-z0-9_-]{6,}$/.test(s) && !s.includes('/')) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('youtu.be')) return u.pathname.split('/').filter(Boolean)[0] || '';
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v') || '';
      const parts = u.pathname.split('/').filter(Boolean);
      const idx = parts.findIndex(x => ['embed','shorts','live'].includes(x));
      if (idx >= 0) return parts[idx+1] || '';
    }
  } catch {}
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m?.[1] || '';
}
