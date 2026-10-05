# PROJECT_STATE – Vidit

## Current Focus
חיבור הממשק ל-`vidit.vplusstudio.app` דרך Cloudflare Workers. פרוס (5.10.2026): https://vidit.vplusstudio.app + https://vidit.ronmailx.workers.dev.
אומת בטלפון — עובד. הצעד הבא: מסמכים משפטיים ב-`docs/legal/`.

## סטטוס
- [x] שרת Node + ממשק עברי RTL (`server.js`, `index.html`)
- [x] פריסה ב-Render: https://vidit-927k.onrender.com (Free, פרנקפורט, auto-deploy מ-main)
- [x] GitHub Pages: https://ronmailx-boop.github.io/vidit/ (ממשק בלבד)
- [x] קבצי Cloudflare: `wrangler.jsonc`, `.assetsignore`, `.github/workflows/deploy-cloudflare.yml`
- [x] הממשק בכתובת סטטית פונה אוטומטית לשרת ב-Render
- [x] כתובת השרת ב-Render מוטמעת מראש ב"הגדרות מתקדמות" (PR #2, אומת בטלפון)
- [x] פירוק פרסומות: זיהוי כתובות פרסום + פענוח VAST/VMAP, תצוגה נפרדת "הסרטון" / "פרסומות"
- [x] mako: סטרים נקי דרך playlist.jsp + בקשת פרסומות (Ad Manager Playlist), פרסומות לישראל נמשכות מהמכשיר (נבדק מול כתבה אמיתית)
- [x] `CORS_ORIGIN` תומך בכמה כתובות מופרדות בפסיק
- [x] מיזוג ל-main (PR #1)
- [x] Secret `CLOUDFLARE_API_TOKEN` בריפו
- [x] פריסה ל-Cloudflare הצליחה (custom domain נוצר)
- [ ] אם `CORS_ORIGIN` מוגדר ב-Render: להוסיף `https://vidit.vplusstudio.app`
- [x] אימות בטלפון: https://vidit.vplusstudio.app (עובד)
- [ ] מסמכים משפטיים ב-`docs/legal/`

## בעיות פתוחות
- Render לא פורס אוטומטית מ-main למרות autoDeploy=yes: Render לא קיבל אף אירוע push מ-GitHub (אין גם commit_ignored) – ה-GitHub App של Render לא מחובר לריפו. התיקון אצל המשתמש: GitHub → Settings → Applications → Render → Configure → להוסיף את vidit. עד שיתוקן: Manual Deploy / trigger_deploy אחרי כל מיזוג שמשנה את `server.js`.

## החלטות
- Cloudflare מגיש רק את `index.html`; השרת נשאר ב-Render (Cloudflare Workers סטטי לא מריץ Node).
