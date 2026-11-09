# Hostinger Setup

1. Create MySQL database/user in hPanel.
2. Import `sql/schema.sql`.
3. Upload the extracted project to a private GitHub repository or Hostinger file deployment.
4. Create Node.js app with Node 22.x.
5. Add environment variables from `.env.example`.
6. Build with `npm run build`.
7. Start with `npm start`.
8. Open `/api/health`; it should return `database: true`.
9. Open `/admin/login` and use `ADMIN_PASSWORD`.
10. Create/import a landing page, set status to Published, and open `/p/<slug>`.

If `/api/health` fails, verify DB host, database, user, password and MySQL user permissions.
