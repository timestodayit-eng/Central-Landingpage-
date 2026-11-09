# Landing CMS Pro v5 Complete

A complete rebuild of the landing-page CMS foundation with flexible JSON import, MySQL persistence, page version snapshots, public publishing, video blocks and lead forms.

## Included

- Next.js + React admin CMS
- MySQL database schema
- Password-protected `/admin`
- Page dashboard
- Create / edit / duplicate / delete pages
- Draft / published status
- Public route: `/p/[slug]`
- Flexible JSON importer
- JSON export
- Builder with addable blocks
- Inline block JSON editing
- Preview mode
- Automatic page version snapshot before every update
- Lead form storage in MySQL
- YouTube video blocks
- Direct MP4 video blocks
- Image, heading, text, button, divider, spacer, form and custom HTML blocks
- Sticky call bar rendering
- Unknown/future JSON block fallback instead of rejecting the whole page
- Five default landing-page categories
- Warm glass CSS helper classes

## JSON roots accepted

The importer accepts all of these:

1. Direct array: `[ ...sections ]`
2. `{ "sections": [ ... ] }`
3. `{ "blocks": [ ... ] }`
4. A single section/block object

The normalizer always converts imported content to:

`section -> columns -> elements`

## Supported element types

- heading
- text
- button
- image
- youtube
- video
- form
- divider
- spacer
- html
- custom
- code
- innersection
- stickyCallBar

Common aliases are normalized automatically. Unknown types are preserved inside a safe custom fallback so one unsupported block does not invalidate the whole import.

## Fresh installation

1. Create a MySQL database in Hostinger.
2. Import `sql/schema.sql` in phpMyAdmin.
3. Copy `.env.example` to `.env.local` locally, or add the same variables to Hostinger environment settings.
4. Use strong values for `DB_PASSWORD`, `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN`.
5. Install dependencies:

```bash
npm install
```

6. Local development:

```bash
npm run dev
```

7. Production build:

```bash
npm run build
npm start
```

8. Check database connection:

`/api/health`

9. Login:

`/admin/login`

10. Published landing pages appear at:

`/p/your-page-slug`

## Hostinger

Recommended:

- Node.js 22.x
- Build command: `npm run build`
- Start command: `npm start`
- Application root: extracted project root

Set all environment variables before first run.

## Database tables

- `categories` - page categories
- `pages` - current page content
- `page_versions` - automatic snapshots before updates
- `leads` - public form submissions
- `site_settings` - CMS-level settings

## Security notes

- `/admin`, page APIs and category APIs require the admin session cookie.
- Public form POST `/api/leads` remains open by design.
- Lead GET endpoint requires admin authentication.
- Custom HTML/JS is rendered inside a sandboxed iframe.
- This package does not include a multi-user/role system. Admin access is controlled by one environment password/session token.

## Video examples

### YouTube

```json
{
  "id": "video-1",
  "type": "youtube",
  "settings": {
    "aspectRatio": "16:9",
    "autoplay": false,
    "mute": false,
    "controls": true,
    "playsinline": true,
    "loop": false,
    "borderRadius": 16
  },
  "content": {
    "videoId": "VIDEO_ID",
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "title": "Video title"
  }
}
```

### MP4 / Reels

```json
{
  "id": "reel-1",
  "type": "video",
  "settings": {
    "aspectRatio": "9:16",
    "autoplay": false,
    "muted": true,
    "controls": true,
    "playsInline": true,
    "loop": true,
    "borderRadius": 16
  },
  "videoUrl": "https://example.com/reel.mp4"
}
```

## Important

This is a complete source-code package for the CMS workflow described above. It has been assembled and structurally checked in the current environment, but a real production deployment still requires your Hostinger MySQL credentials and an `npm install` / `npm run build` in the deployment environment.
