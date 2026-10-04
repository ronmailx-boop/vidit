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

## ממשק על GitHub Pages
GitHub Pages מגיש רק קבצים סטטיים, ולכן `server.js` חייב לרוץ ב-Render.
אם `index.html` מוגש מ-GitHub Pages: פותחים "הגדרות מתקדמות" וממלאים את כתובת השרת
(למשל `https://vidit.onrender.com`). הכתובת נשמרת בדפדפן.
ב-Render מגדירים `CORS_ORIGIN` לכתובת של Pages (למשל `https://ronmailx-boop.github.io`).

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
