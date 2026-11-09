# Landing CMS Pro v5 Complete

Fresh deployment package for Hostinger + GitHub + MySQL.

## Main features
- Single-admin login, no public registration
- Fixed page categories: Pro, Call, Trust, FOMO, Review
- Unlimited pages, draft/publish, duplicate, public `/p/[slug]` URLs
- Unicode/Bangla and English slugs
- Elementor-style visual builder
- Section -> columns -> inner section -> elements
- Heading, Text, Button, Image, YouTube Video, Divider, Spacer, Form, Inner Section, Raw HTML/CSS/JS
- Desktop and mobile section padding controls
- **Default section padding = 0 on desktop and mobile**
- **Default column padding = 0**
- **Default gap = 0**
- **Content width = 0 means full width**
- Global Header editor
- Global Footer editor + optional sticky footer
- GTM, Meta Pixel, GA4 and global custom code
- SEO/page meta settings
- Analytics/event tracking
- Visual form builder and form submissions
- **Image upload + Media Library**

## Image upload
Images are stored in MySQL in the `media` table instead of the deployed filesystem. This prevents uploaded images from disappearing after a Hostinger redeploy.

Supported: JPG, PNG, WEBP, GIF. Maximum: 4 MB per image.

Use either:
- Admin -> Media Library
- Page Builder -> Image element -> Upload / Media Library

Uploaded image URLs look like `/media/12`.

## Fresh Hostinger deployment
1. Create a new GitHub repository.
2. Upload the **contents** of this folder so `package.json`, `app`, `components`, `lib`, `sql` are in the repository root.
3. Create a new Hostinger MySQL database and user.
4. Open phpMyAdmin, select that database, then import `sql/schema-hostinger.sql`.
5. In Hostinger Web App Environment Variables, add values using `.env.example` as the key list. Do not upload a real `.env` file to GitHub.
6. Build configuration:
   - Install: `npm install`
   - Build: `npm run build`
   - Output: `.next`
   - Start: `npm start`
7. Deploy and open `/admin`.

## Database connection
Use the exact full database name, full database username and password shown in Hostinger. The example uses `MYSQL_HOST=127.0.0.1`; if Hostinger explicitly provides a different database host for your web app, use the Hostinger value.

An `Access denied for user ...` error is a MySQL credential/permission issue, not a page-builder issue.

## Upgrade from v4 without deleting data
Back up the database first. Then import only:

`sql/migrate-v4-to-v5.sql`

Do **not** re-import the full schema over an existing database.

## Header / footer
Admin -> Header / Footer / Tracking.

The editor saves these settings in the existing `settings` table. Footer HTML/CSS is rendered on published landing pages by `app/p/layout.js` through `components/GlobalChrome.js`.

## Form builder
Add a `Form` element in the visual builder. Fields can be added/removed visually and support Text, Phone, Email, Number, Date and Textarea. Submissions are stored in `form_submissions` and can be viewed from Admin -> Form Submissions.

## Security note
Never commit database passwords, admin passwords, or session secrets to GitHub. If credentials have previously appeared in screenshots or chat, rotate them before using this deployment.

## v5.1 - Per-domain Site Identity
When the same GitHub repository is deployed to multiple domains, each deployment can use its own MySQL database and set its own branding from:

`Admin -> Site Settings -> Site Identity`

Editable values:
- Site Title
- Site Name
- Meta Description
- Favicon (upload/select from Media Library)
- Site Logo (upload/select from Media Library)

No code edit or redeploy is needed after saving these values.

For an existing v5 database, import:
`sql/migrate-v5-to-v5.1-site-identity.sql`

The settings table is key/value based, so this migration does not alter or delete existing pages, templates, media, forms, analytics, header or footer settings.
