# PROJECT_STATE – Vidit

## Current Focus
חיבור הממשק ל-`vidit.vplusstudio.app` דרך Cloudflare Workers. פרוס (5.10.2026): https://vidit.vplusstudio.app + https://vidit.ronmailx.workers.dev.
הצעד הבא: בדיקה בטלפון; אם `CORS_ORIGIN` מוגדר ב-Render — להוסיף את הכתובת החדשה.

## סטטוס
- [x] שרת Node + ממשק עברי RTL (`server.js`, `index.html`)
- [x] פריסה ב-Render: https://vidit-927k.onrender.com (Free, פרנקפורט, auto-deploy מ-main)
- [x] GitHub Pages: https://ronmailx-boop.github.io/vidit/ (ממשק בלבד)
- [x] קבצי Cloudflare: `wrangler.jsonc`, `.assetsignore`, `.github/workflows/deploy-cloudflare.yml`
- [x] הממשק בכתובת סטטית פונה אוטומטית לשרת ב-Render
- [x] `CORS_ORIGIN` תומך בכמה כתובות מופרדות בפסיק
- [x] מיזוג ל-main (PR #1)
- [x] Secret `CLOUDFLARE_API_TOKEN` בריפו
- [x] פריסה ל-Cloudflare הצליחה (custom domain נוצר)
- [ ] אם `CORS_ORIGIN` מוגדר ב-Render: להוסיף `https://vidit.vplusstudio.app`
- [ ] אימות בטלפון: https://vidit.vplusstudio.app
- [ ] מסמכים משפטיים ב-`docs/legal/`

## החלטות
- Cloudflare מגיש רק את `index.html`; השרת נשאר ב-Render (Cloudflare Workers סטטי לא מריץ Node).
