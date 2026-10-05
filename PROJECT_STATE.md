# PROJECT_STATE – Vidit

## Current Focus
חיבור הממשק ל-`vidit.vplusstudio.app` דרך Cloudflare Workers. מוזג ל-main (PR #1); הפריסה דילגה כי אין עדיין Secret.
הצעד הבא: המשתמש מוסיף את `CLOUDFLARE_API_TOKEN`, מריצים שוב את "Deploy to Cloudflare" (Run workflow) ובודקים בלוג את שורת ה-custom domain.

## סטטוס
- [x] שרת Node + ממשק עברי RTL (`server.js`, `index.html`)
- [x] פריסה ב-Render: https://vidit-927k.onrender.com (Free, פרנקפורט, auto-deploy מ-main)
- [x] GitHub Pages: https://ronmailx-boop.github.io/vidit/ (ממשק בלבד)
- [x] קבצי Cloudflare: `wrangler.jsonc`, `.assetsignore`, `.github/workflows/deploy-cloudflare.yml`
- [x] הממשק בכתובת סטטית פונה אוטומטית לשרת ב-Render
- [x] `CORS_ORIGIN` תומך בכמה כתובות מופרדות בפסיק
- [x] מיזוג ל-main (PR #1)
- [ ] Secret `CLOUDFLARE_API_TOKEN` בריפו (רק המשתמש)
- [ ] אם `CORS_ORIGIN` מוגדר ב-Render: להוסיף `https://vidit.vplusstudio.app`
- [ ] אימות בטלפון: https://vidit.vplusstudio.app
- [ ] מסמכים משפטיים ב-`docs/legal/`

## החלטות
- Cloudflare מגיש רק את `index.html`; השרת נשאר ב-Render (Cloudflare Workers סטטי לא מריץ Node).
