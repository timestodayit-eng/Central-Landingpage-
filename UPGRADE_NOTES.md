# React Landing CMS visual upgrade

This is the complete original repository with opt-in visual enhancements.

- **New**: `components/VisualEffectsSettings.js`, `lib/visualEffects.js`, `app/visual-effects.css`
- **Updated**: `components/Builder.js`, `components/BlockRenderer.js`, `app/layout.js`, `lib/builder.js`
- **Unchanged**: database, API routes, authentication, media, page publishing and existing template system.

## Install
1. Back up your repository and MySQL database.
2. Upload these files to your GitHub repository keeping their paths.
3. Let deployment run `npm install && npm run build`.
4. Open Admin > Pages > editor; select a section, column or element; expand **Advanced Visual Effects**.
5. Choose frosted glass, gradient, background image, shadows, borders and hover animation.
6. Preview desktop/mobile, save then verify published output.

No SQL migration is required for these styling settings because page blocks serialize settings in `blocks_json`.

Cautions: old page styles are preserved unless you select new visual options. Existing advanced YouTube settings are preserved, but custom poster/play/analytics are not fully implemented by this visual upgrade. The supplied package includes your repository source, not runtime MySQL records, environment secrets, or uploaded media stored in your database.
