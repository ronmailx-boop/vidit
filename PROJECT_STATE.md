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
- [x] mako: סטרים נקי דרך playlist.jsp + בקשת פרסומות (Ad Manager Playlist), פרסומות לישראל נמשכות מהמכשיר (נבדק מול כתבה אמיתית; הפרסומות הופיעו בטלפון – אומת ע"י המשתמש)
- [x] כפתור הורדה: קובץ בפורמט המקורי, סטרים HLS מומר ל-MP4 בשרת (mux.js) – נבדק מול mako (5:41, 38MB, H.264+AAC)
- [x] אימות הורדה בטלפון (mako: הקובץ נשמר ומתנגן)
- [x] אייקון (וריאציה 1: נגן וקישור) – `icons/` + `manifest.webmanifest` + favicon/apple-touch-icon; Render מגיש אותם מרשימה סגורה
- [x] אייקון ב-apps.vplusstudio.app (ריפו my-site, אומת בטלפון): נשלף אוטומטית מה-manifest ב-GitHub Pages; האריח מפנה ל-vidit.vplusstudio.app
- [x] שרת רדום (Render חינמי נרדם אחרי ~15 דק'): הממשק מעיר אותו כשהדף נפתח, ואם בקשה נופלת בזמן ההתעוררות – מציג "השרת מתעורר…", מחכה ל-/health ומנסה שוב (דווח בכתבת mako ארוכה, 57 דק')
- [x] CORS: ב-Render מוגדר `CORS_ORIGIN=https://ronmailx-boop.github.io` בלבד, ולכן הדפדפן חסם את התשובות ל-vidit.vplusstudio.app ("לא הצלחתי להתחבר לשרת"). תוקן בקוד: הכתובות של הממשק (vidit.vplusstudio.app, workers.dev, github.io) מותרות תמיד. ב-Render מוגדר גם `ACCESS_KEY`.
- [x] מפתח גישה: נשמר במכשיר כבר בהקלדה (בלי רווחים מסביב), עם אישור "המפתח שמור במכשיר הזה" / אזהרה כשהדפדפן לא מאפשר שמירה. הזיכרון נפרד לכל כתובת (vidit.vplusstudio.app ≠ github.io).
- [x] `CORS_ORIGIN` תומך בכמה כתובות מופרדות בפסיק
- [x] מיזוג ל-main (PR #1)
- [x] Secret `CLOUDFLARE_API_TOKEN` בריפו
- [x] פריסה ל-Cloudflare הצליחה (custom domain נוצר)
- [ ] אם `CORS_ORIGIN` מוגדר ב-Render: להוסיף `https://vidit.vplusstudio.app`
- [x] אימות בטלפון: https://vidit.vplusstudio.app (עובד)
- [ ] מסמכים משפטיים ב-`docs/legal/`

## החלטות
- Render מחובר ל-GitHub דרך ה-GitHub App (חובר 5.10.2026) – פריסה אוטומטית מכל קומיט ל-main. לפני כן השירות הוגדר כ-Public Git Repository ולא קיבל אירועי push.
- Cloudflare מגיש רק את `index.html`; השרת נשאר ב-Render (Cloudflare Workers סטטי לא מריץ Node).
