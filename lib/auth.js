export function adminCookieName(){ return 'lcms_admin'; }
export function adminSessionToken(){ return process.env.ADMIN_SESSION_TOKEN || process.env.ADMIN_PASSWORD || ''; }
export function validPassword(value){ return !!process.env.ADMIN_PASSWORD && value === process.env.ADMIN_PASSWORD; }
export function validToken(value){ return !!value && value === adminSessionToken(); }
