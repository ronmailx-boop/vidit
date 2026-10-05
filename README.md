# Vidit

שרת Node קטן, בלי תלויות. נותנים לו כתובת של דף HTML והוא מחזיר את כתובות הווידאו שבו.
כולל ממשק מובייל בעברית (RTL, סגול) שמוגש מאותו שרת.

## קבצים
- `server.js` – השרת, ההורדה והחילוץ
- `index.html` – הממשק
- `package.json`

## פריסה ב-Render (מהנייד)
1. מעלים את 3 הקבצים לריפו חדש ב-GitHub.
2. ב-Render: New ← Web Service ← בוחרים את הריפו.
3. Runtime: Node. Build Command: ריק (או `npm install`). Start Command: `node server.js`.
4. מומלץ: Environment ← `ACCESS_KEY` עם סיסמה כלשהי, כדי שרק אתה תוכל להשתמש בשרת.
5. אחרי הפריסה פותחים את הכתובת של השירות ומדביקים קישור של דף.

## כתובות
- **https://vidit.vplusstudio.app** – הממשק (Cloudflare Workers, קבצים סטטיים בלבד).
- **https://vidit-927k.onrender.com** – השרת (Render). מגיש גם את הממשק וגם את ה-API.
- https://ronmailx-boop.github.io/vidit/ – עותק של הממשק ב-GitHub Pages.

Cloudflare ו-GitHub Pages מגישים רק את `index.html`. כשהממשק רץ שם, הוא שולח את הבקשות
לשרת ב-Render אוטומטית (אפשר לשנות כתובת שרת ב"הגדרות מתקדמות").
אם הוגדר ב-Render `CORS_ORIGIN`, צריך לכלול בו את כל הכתובות, מופרדות בפסיק:
`https://vidit.vplusstudio.app,https://ronmailx-boop.github.io`

## פריסה ל-Cloudflare
כל push ל-`main` מפעיל את `.github/workflows/deploy-cloudflare.yml` (wrangler).
נדרש Secret בריפו בשם `CLOUDFLARE_API_TOKEN` (תבנית Edit Cloudflare Workers, zone `vplusstudio.app`).
בלי ה-Secret הפריסה מדלגת. `.assetsignore` קובע שרק הממשק עולה (בלי `server.js`).

## שימוש כ-API (מאפליקציות אחרות)
`GET /api/scrape?url=<כתובת הדף>&depth=1`

- `depth=1` – מחפש גם בתוך נגני iframe (עד 3)
- `all=1` – מחזיר גם קישורים שלא זוהו כווידאו
- אם הוגדר `ACCESS_KEY`: שולחים header בשם `x-key`

התשובה: `{ ok, title, poster, finalUrl, results: [{ url, kind, source }], notes }`
כאשר `kind` הוא `stream` (m3u8/mpd), `file` (mp4 וכו'), או `embed` (נגן מוטמע).

## אבטחה
- חסום חיבור לכתובות פנימיות (localhost, 10.x, 192.168.x, 169.254.x ועוד), גם דרך הפניות ו-DNS.
- פורטים מותרים: 80 ו-443 בלבד. דף עד 3MB. זמן המתנה עד 12 שניות.
- הגבלה של 30 בקשות ל-10 דקות לכל IP.
- `ALLOW_PRIVATE=1` מיועד לבדיקות מקומיות בלבד. לא להגדיר בשרת אמיתי.

## מגבלה חשובה
השרת מוריד את ה-HTML כפי שהוא, בלי להריץ JavaScript. אם הנגן באתר טוען את הסרטון
רק אחרי שהדף נפתח (קורה הרבה באתרי חדשות), הכתובת לא תופיע בתוצאות.
במקרה כזה צריך דפדפן ללא ממשק (Playwright), שדורש שרת חזק יותר.
