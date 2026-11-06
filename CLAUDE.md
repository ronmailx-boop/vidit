# Project Instructions for Claude Code

אנחנו עובדים דרך Claude Code. כל השינויים נכתבים ונשמרים ישירות ב-Repository.

## חוקי זיכרון והמשכיות בין שיחות (חובה)

- ניהול הזיכרון מתבצע דרך קובץ בשם `PROJECT_STATE.md` בשורש ה-Repository.
- בתחילת כל שיחה חדשה, קרא את `PROJECT_STATE.md` כדי לדעת איפה הפסקנו ומה הסטטוס הנוכחי.
- עדכון בזמן אמת: בכל פעם שאתה משלים משימה או כותב קוד, עדכן מיד את `PROJECT_STATE.md` וסמן `[x]` על המשימה שהושלמה.
- סיום שיחה: אם אגיד "ביי", "נמשיך מחר" או "תסכם" — עדכן את הסעיף "Current Focus" בקובץ עם הנקודה המדויקת שבה הפסקנו והצעד הבא לביצוע.
- ניהול Context: בסיום שלב/פיצ'ר משמעותי (ולא רק כשה-context מתמלא אוטומטית), עדכן קודם את `PROJECT_STATE.md` ואז הצע להריץ `/compact` עם הנחיה ממוקדת (למשל: שמור על רשימת הקבצים ששונו, המשימות הפתוחות וההחלטות האחרונות). אל תמתין ל-compact האוטומטי (95%) כברירת מחדל.

## כללי פיתוח, עיצוב וביצועים

- כל הקוד חייב להיות מותאם לנייד (Mobile-First).
- תמיכה מלאה בעברית ו-RTL.
- כשמבקשים ממך ליצור תוכנית עבודה (Plan), הצג רק תוכנית מפורטת ואל תבצע שינויי קוד גדולים עד לקבלת אישור מפורש.
- **עיצוב וקוד נקי:** שמור על HTML נקי וקריא. אל תוסיף ARIA attributes "כברירת מחדל" או בלי סיבה פונקציונלית ברורה — אבל כן הוסף אותם במקומות שבהם הם נדרשים בפועל לנגישות אמיתית (טפסים, כפתורי אייקון ללא טקסט, הודעות שגיאה דינמיות, מודלים, ניווט מקלדת). המטרה היא לא "לנפח" קוד סתם — לא להתעלם מנגישות אמיתית, במיוחד לאור דרישת ה-IS 5568 למטה.
- **ביצועים וניהול שגיאות:** שמור על קוד קל משקל, ותפוס שגיאות רשת/שרת עם הודעה ברורה למשתמש בעברית.
- **הודעות Commit:** תאר הודעות Commit קצרות באנגלית (למשל `feat:...`, `fix:...`).

## כללי אבטחה וסודות (Security Rules)

**חשוב: ההתייחסות שונה בין Backend לבין אפליקציות סטטיות — אל תערבב בין השניים.**

### Backend / GitHub Actions (Render, סקרייפרים, פונקציות שרת)
- לעולם אל תשתול מפתחות אבטחה, סיסמאות או API Keys בקוד הגלוי.
- השתמש במשתני סביבה: `.env` מקומי (עם `.env` ב-`.gitignore`) ו-GitHub Secrets / Render Environment Variables בפריסה.
- צור קובץ `.env.example` שמעלים ל-GitHub עם שמות המשתנים בלבד, ללא ערכים אמיתיים (למשל `FIREBASE_API_KEY=your_key_here`).

### אפליקציות סטטיות בצד-לקוח (GitHub Pages + Firebase Web SDK)
- מפתחות ה-Firebase Web SDK (`apiKey`, `authDomain` וכו') **חשופים מטבעם** בקוד הצד-לקוח — זו התנהגות תקנית של Firebase ולא פגם אבטחה.
- ההגנה האמיתית היא **Firestore/Storage Security Rules**, לא הסתרת המפתחות. אל תציע להעביר אותם ל-`.env` או ל-build step בפרויקט סטטי — זה לא רלוונטי ל-GitHub Pages.
- אם משהו כן צריך להישאר סודי אמת (מפתח API של שירות צד-שלישי בתשלום, טוקן עם הרשאות כתיבה רחבות) — הוא לא שייך לקוד קליינט בכלל, גם לא ב-`.env`; הוא צריך לעבור דרך Cloud Function / Backend.

### סניטציה ואבטחת קלט
- בצע ניקוי וסניטציה לכל קלט שמגיע מהמשתמש לפני שמירתו ב-Firebase / LocalStorage או הצגתו במסך (מניעת XSS).

## Legal & Compliance Documents

- **Location:** All legal documents must be stored in `docs/legal/`.
- **Required Files:**
  - `docs/legal/privacy-policy.md` (Privacy Policy - Israeli Law & GDPR compliant)
  - `docs/legal/terms-of-service.md` (Terms of Use)
  - `docs/legal/cookie-policy.md` (Cookie Policy)
  - `docs/legal/accessibility-statement.md` (Accessibility Statement - IS 5568 / WCAG 2.1 AA)
- **Language & Formatting:** Written in formal Hebrew, formatted in clean Markdown with placeholders like `[PLACEHOLDER]` where specific dynamic context is needed.

## פריסה ל-Cloudflare ודומיין (כללי — לכל אפליקציה, חדשה או קיימת)

השיטה הקבועה לכל האפליקציות. נבדקה ועובדת (EasyPen על תת-דומיין, vplus-studio על הדומיין הראשי — 1.10.2026). כשמבקשים "תעלה ל-Cloudflare" או "תחבר ל-xxx.vplusstudio.app" — פועלים לפי הסעיף הזה.

**עובדות קבועות**
- חשבון Cloudflare אחד. Account ID (לא סודי): `1c9c1dd0e8a1d80f324b974ae6a617fb`.
- כתובת ברירת מחדל: `<name>.ronmailx.workers.dev`. כתובת קבועה/מסחרית: `<app>.vplusstudio.app` (הדומיין נקנה באותו חשבון).
- הפריסה רק דרך **GitHub Actions + wrangler + API Token** ל-Cloudflare **Workers** (static assets).
- **לא** לחבר את GitHub דרך לוח הבקרה של Cloudflare (Pages → Import Git / Workers → Connect GitHub) ולא להשתמש ב-Cloudflare Pages — בנייד זה נתקע בלולאה.
- הכתובת ב-Cloudflare ממשיכה לעבוד גם אם הריפו הופך לפרטי (GitHub Pages בחינם — לא).

**לפני שמתחילים (באפליקציה קיימת)**
- לבדוק איך היא מתארחת היום (GitHub Pages / Vercel / Render) ואם יש שלב build. Cloudflare נוסף **במקביל** — לא מוחקים אירוח קיים בלי אישור.
- Cloudflare כאן מגיש קבצים סטטיים בלבד. Backend וסודות נשארים במקומם.
- לוודא שאין כבר Worker באותו `name` בחשבון (למשל `workers_list` אם יש חיבור Cloudflare) — אחרת הפריסה תדרוס אותו.

**שלושה קבצים בריפו**
1. `wrangler.jsonc`:
   ```jsonc
   // Cloudflare Workers: serves the app as static assets (no Worker script).
   {
     "name": "<app>",
     "compatibility_date": "<today YYYY-MM-DD>",
     "assets": { "directory": "." },
     "workers_dev": true,
     "routes": [{ "pattern": "<app>.vplusstudio.app", "custom_domain": true }]
   }
   ```
   - `name`: אותיות קטנות, ספרות ומקפים; קובע את כתובת ה-workers.dev.
   - אתר עם build (Vite/React וכו'): `directory` = תיקיית הפלט (`dist`/`build`). SPA עם ניתוב בצד-לקוח: להוסיף ל-`assets` את `"not_found_handling": "single-page-application"`.
   - **`"workers_dev": true` חובה כשיש `routes`** — בלי זה wrangler מכבה את הכתובת החינמית `<name>.ronmailx.workers.dev` (קרה ב-EasyPen). כך שתי הכתובות עובדות במקביל.
   - בלי דומיין עדיין: להשמיט את `routes`.
   - **אתר ראשי של העסק** (כמו vplus-studio) עולה על הדומיין עצמו ולא על תת-דומיין, יחד עם `www`, כדי שמי שמקליד www לא יקבל שגיאה:
     ```jsonc
     "routes": [
       { "pattern": "vplusstudio.app", "custom_domain": true },
       { "pattern": "www.vplusstudio.app", "custom_domain": true }
     ]
     ```
     רק אתר אחד יכול לתפוס את הדומיין הראשי (`vplusstudio.app` כבר תפוס ע"י vplus-studio); כל אפליקציה מקבלת תת-דומיין `<app>.vplusstudio.app`.
2. `.assetsignore` (רק כש-`directory` הוא `"."`) — מה **לא** עולה לאתר. להתאים לקבצים של הפרויקט, ולוודא שלא עולה שום דבר פרטי (`.env`, תיעוד פנימי):
   ```
   .git
   .github
   .claude
   .wrangler
   node_modules
   tests
   package.json
   package-lock.json
   wrangler.jsonc
   .assetsignore
   .gitignore
   CLAUDE.md
   PROJECT_STATE.md
   README.md
   ```
3. `.github/workflows/deploy-cloudflare.yml`:
   ```yaml
   # Deploys to Cloudflare Workers (see wrangler.jsonc) on every push to main.
   # Needs the repository secret CLOUDFLARE_API_TOKEN (template "Edit Cloudflare Workers").
   name: Deploy to Cloudflare
   on:
     push:
       branches: [main]
     workflow_dispatch:
   concurrency:
     group: deploy-cloudflare
     cancel-in-progress: true
   jobs:
     deploy:
       runs-on: ubuntu-latest
       permissions:
         contents: read
       env:
         CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
         CLOUDFLARE_ACCOUNT_ID: 1c9c1dd0e8a1d80f324b974ae6a617fb
       steps:
         - name: Check for API token
           id: token
           run: |
             if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
               echo "::notice::CLOUDFLARE_API_TOKEN secret is not set - skipping deploy."
               echo "present=false" >> "$GITHUB_OUTPUT"
             else
               echo "present=true" >> "$GITHUB_OUTPUT"
             fi
         - uses: actions/checkout@v4
           if: steps.token.outputs.present == 'true'
         - uses: actions/setup-node@v4
           if: steps.token.outputs.present == 'true'
           with:
             node-version: 22
         # Only for apps with a build step:
         # - run: npm ci && npm run build
         #   if: steps.token.outputs.present == 'true'
         - name: Deploy
           if: steps.token.outputs.present == 'true'
           run: npx --yes wrangler@4 deploy
   ```

**מה רק המשתמש עושה (פעם אחת לכל ריפו)** — Claude לא יכול להגדיר Secrets:
1. Cloudflare → My Profile → API Tokens → Create Token → תבנית **Edit Cloudflare Workers** → Account Resources: Include + החשבון → Zone Resources: Include + **Specific zone** → `vplusstudio.app` (אם האפליקציה בדומיין אחר — את הדומיין שלה; נבדק ב-vplus-studio: מספיק גם לדומיין הראשי וגם ל-www, בלי הרשאות נוספות) → שם לפי הפרויקט (`<app>-deploy`) → Create Token → Copy.
2. GitHub → הריפו → Settings → Secrets and variables → Actions → New repository secret → שם `CLOUDFLARE_API_TOKEN`.
- **מפתח נפרד לכל פרויקט** — ההמלצה המקובלת (מפתח לכל מטרה, לא מפתח-על אחד). זה לא מגביל הרשאות: כל מפתח מהתבנית יכול לשנות כל Worker בחשבון (Cloudflare לא מגביל מפתח ל-Worker אחד). היתרון: מבטלים/מחליפים מפתח שדלף בלי לשבור את הפריסה בריפו אחרים, ולפי השם יודעים מאיפה דלף. מפתחות ישנים עם All zones ממשיכים לעבוד — לא חובה להחליף.
- **החלפה (Roll)** לפחות פעם בשנה, ומיד בחשד לדליפה: Cloudflare → My Profile → API Tokens → המפתח → Roll → להעתיק → לעדכן את ה-Secret `CLOUDFLARE_API_TOKEN` באותו ריפו.
- לעולם לא לבקש להדביק אותו בצ'אט, ולא לשמור בקוד או בקובץ — רק כ-Secret.
- בלי ה-Secret ה-workflow מדלג (לא נכשל) — אפשר למזג את הקבצים לפני שהמשתמש מוסיף אותו.

**אחרי המיזוג — אימות**
- להפעיל/לחכות ל-workflow "Deploy to Cloudflare" ולקרוא את לוג ה-job: צריכות להופיע כתובת ה-workers.dev והשורה `<app>.vplusstudio.app (custom domain)`. ה-DNS ותעודת ה-HTTPS נוצרים לבד — **לא נוגעים בלוח הבקרה**.
- סביבת Claude בענן לא מגיעה לכתובות האלה (curl מחזיר 000) — המשתמש בודק בטלפון. תעודה חדשה יכולה לקחת 5–15 דקות. אסור `sleep` — לחכות ללוג עם לולאת until.
- נכשל על הרשאה → להוסיף הרשאה **למפתח הקיים** של הפרויקט, לא ליצור מפתח חדש.
- דומיין `.app` מחייב HTTPS (HSTS); Cloudflare מטפל בזה.

**כיבוי הכתובת החינמית `workers.dev`** (נבדק בפועל על flydeal, 2.10.2026)

ברירת המחדל (`workers_dev: true`) משאירה את שתי הכתובות פעילות
במקביל. אם רוצים **רק** את הדומיין המותאם:

1. ב-`wrangler.toml`/`wrangler.jsonc`: `workers_dev: false`.
2. **חובה גרסת Wrangler 4 ומעלה.** עם Wrangler 3 (גם עם כל ההרשאות
   הנכונות בטוקן) הפריסה נכשלת באופן עקבי עם
   `A request to the Cloudflare API (/zones/.../workers/routes) failed.
   No access to the specified resource.` - זה באג/מגבלה אמיתית
   בגרסה הישנה בשילוב `custom_domain` + `workers_dev: false`, **לא**
   בעיית הרשאות (נבדק: 5 טוקנים שונים עם הרשאות מלאות, כולם נכשלו
   זהה; הבעיה נפתרה מיידית אחרי שדרוג ל-v4). ב-`cloudflare/wrangler-action`:
   `wranglerVersion: "4"`. בקריאה ישירה (`npx --yes wrangler@4 deploy`,
   התבנית הסטנדרטית למעלה) - זה כבר תקין.
3. (לפי תיעוד Cloudflare הרשמי, ליתר ביטחון): לוודא שלטוקן יש גם
   **Zone → Workers Routes → Edit** (בנוסף ל-Workers Scripts:Edit) -
   My Profile → API Tokens → הטוקן → Edit → Permissions → Add more.
4. Push. הלוג אחרי דיפלוי מוצלח יראה **רק** את שורת ה-Custom Domain,
   בלי שורת workers.dev.

**כיבוי דרך הדשבורד** (ידני, בלי דיפלוי): Worker → Settings →
Domains & Routes → ליד `workers.dev` → Disable. **אזהרה:** בלי
`workers_dev: false` גם בקובץ - הדיפלוי הבא יחזיר את workers.dev
אוטומטית.


**אפליקציה עם Service Worker / PWA / אחסון מקומי**
- Cloudflare מפנה `page.html` → `/page`, ודפדפן מסרב להגיש מהמטמון תגובה מופנית לניווט → האופליין נשבר. כל תגובה לפני `cache.put` עוברת דרך `unredirect`, ובחיפוש ניווט במטמון מנסים גם את גרסת ה-`.html`:
  ```js
  async function unredirect(response) {
    if (!response.redirected) return response;
    return new Response(await response.blob(), {
      status: response.status, statusText: response.statusText, headers: response.headers
    });
  }
  // /legal → /legal.html, / → /index.html
  function prettyToHtml(href) {
    const u = new URL(href);
    u.search = '';
    if (u.pathname.endsWith('/')) u.pathname += 'index.html';
    else if (!/\.[a-z0-9]+$/i.test(u.pathname)) u.pathname += '.html';
    return u.href;
  }
  ```
- כתובת חדשה = origin חדש: נתונים מקומיים (localStorage / IndexedDB) והתקנת PWA **לא עוברים**. לחבר את הדומיין לפני שמשווקים; באפליקציה קיימת עם משתמשים — להזהיר את המשתמש לפני שמפנים אליה.
- Firebase Auth / OAuth: להוסיף את הדומיין החדש ל-Authorized domains (אחרת ההתחברות תיכשל בכתובת החדשה).
- לעדכן את הכתובת ב-README, ב-PROJECT_STATE.md, וב-manifest / מסמכים משפטיים אם היא מופיעה בהם.

﻿## Publishing this Android app to Google Play (universal instructions)


### Owner account type (read first)
- The owner (Ron) publishes with a Google Play **organization** developer account (brand: Vplus Studio). Account-type-dependent rules:
  - The closed-test requirement (at least 12 testers opted in continuously for 14 days before applying for production access) applies ONLY to **personal** developer accounts created after Nov 13, 2023. Organization accounts have NO testing requirement before production. Source: https://support.google.com/googleplay/android-developer/answer/14151465
  - Exception: if a specific app was originally created under a personal account and later transferred to the organization account, the testing requirement can stay attached to that app. Check that app's Play Console Dashboard for "Apply for production" before assuming it is exempt.
  - The Android-device verification via the Play Console mobile app is also a personal-account-only requirement.
- Do NOT tell the owner to recruit 12 testers or wait 14 days for production access. Internal testing below is optional QA, not a Google requirement for his account type.


### Goal and division of work
- Goal: a GitHub Actions workflow builds a signed AAB and uses fastlane `supply` (`upload_to_play_store`) to upload the AAB, store listing text and images to the **Internal testing** track as a **draft** release. The owner (Ron) reviews it in Play Console and presses publish/promote manually. NEVER try to publish to production or promote tracks automatically.
- The owner works only from the Claude Code Android app (cloud GitHub sessions, no PC). Do all file work in the repo, commit to a branch, and open a PR or push as the owner prefers. You cannot read or set GitHub secrets. Tell the owner exactly which secrets to add and where; never ask for secret values in chat.
- No skill needs to be installed. Everything uses standard tools on the GitHub runner (Ruby, fastlane, Java, Android SDK/Gradle or Node).


### Step 0: Discover, do not assume
Before writing anything, inspect the repo and fill these values. Ask the owner only for what cannot be found:
- `PACKAGE_NAME` (applicationId): look in `app/build.gradle(.kts)`, `android/app/build.gradle`, `capacitor.config.*` (appId), or `twa-manifest.json` (packageId). It must match the Play Console app exactly. Package names are unique and permanent once the app is created.
- `APP_KIND`: native Gradle project, Capacitor/Cordova, or a PWA wrapped as TWA (Bubblewrap / PWABuilder). The owner's apps are mostly PWAs, so an Android wrapper is usually needed. If there is no Android project yet, create one (Bubblewrap `init`/`build` or Capacitor `add android`) and commit it.
- `ANDROID_DIR` (folder containing `gradlew`) and the expected AAB output path (usually `<ANDROID_DIR>/app/build/outputs/bundle/release/app-release.aab`).
- `APP_NAME`, supported locales (default `he-IL` and `en-US`), and whether `fastlane/` already exists.
Write the discovered values at the top of `fastlane/README-publish.md` so later sessions do not re-discover them.


### One-time manual steps per app (the owner does these, you remind him)
1. Create the app in Play Console (name, package name, default language, app or game, free or paid, accept the Developer Program Policies / US export laws declarations and the Play App Signing Terms of Service). Package name is fixed forever after app creation.
2. Build the first AAB (run the workflow with `upload=false`, download the artifact) and upload it manually once to Internal testing. fastlane cannot create the app or do the first upload: Google requires the app to exist with at least one manually uploaded build before the API works.
3. Complete the required Play Console forms: privacy policy URL, app access, ads declaration, content rating, target audience, data safety, and app category. The API does not do these.
4. Add testers (an email list) to the Internal testing track (up to 100 testers on Internal).
Testing requirement note: the closed-test rule (12 testers opted in continuously for 14 days, then "Apply for production", review ~7 days) applies only to PERSONAL developer accounts created after Nov 13, 2023. The owner's account is an ORGANIZATION account, so it does NOT apply; he can publish to production without a closed test (https://support.google.com/googleplay/android-developer/answer/14151465). Only exception: an app that started under a personal account and was transferred - check that app's Dashboard.


### One-time setup per developer account (shared by all apps)
1. Google Cloud Console: create or pick a project, enable the **Google Play Android Developer API** (fastlane's docs call it "Google Play Developer API"), create a **service account**, and create a JSON key for it (Actions > Manage keys > Add key > Create new key > JSON). No IAM roles are needed on the service account itself.
2. Play Console > Users and permissions > Invite new users: paste the service account email, and grant these permissions (exact names in Play Console):
   - "Release apps to testing tracks" (create, edit and roll out releases on internal/closed/open tracks)
   - "Manage store presence" (store listing text and graphics)
   - "View app information and download bulk reports (read-only)" (account level; the app-level equivalent is "View app information (read-only)")
   Grant them as account permissions to cover all current and future apps. Do NOT grant "Release to production, exclude devices, and use Play App Signing" - the owner publishes manually.
3. Accept all pending agreements in Play Console (see TOS_NOT_ACCEPTED below).
4. Permissions are not instant: usually minutes, occasionally up to ~24 hours (sometimes more). On a 403 right after granting, wait and retry before changing anything.
5. Optional connection test, run anywhere with Ruby: `fastlane run validate_play_store_json_key json_key:/path/to/key.json`.
Do not ask for the JSON in chat. The owner pastes the entire file contents into the repo secret.


### GitHub repo secrets (owner adds, per repo)
- `PLAY_SERVICE_ACCOUNT_JSON`: full JSON key text.
- `ANDROID_KEYSTORE_BASE64`: upload keystore, base64 (`base64 -w0 upload.jks`; create it with `keytool -genkeypair` on any machine or in a one-off Actions run, and have the owner store it safely; losing it requires a Play "upload key reset"). Keep a private backup of the keystore outside GitHub.
- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
- Use Play App Signing (required for new apps; its Terms of Service are accepted when creating the app). The keystore here is only the upload key.
Never print secrets in logs. Never commit keystores, JSON keys or `.env`. Add them to `.gitignore`.


### Files to create
`Gemfile`:
```
source "https://rubygems.org"
gem "fastlane"
```
`fastlane/Appfile`:
```
package_name(ENV["PACKAGE_NAME"] || "REPLACE_WITH_PACKAGE_NAME")
```
`fastlane/Fastfile`:
```ruby
default_platform(:android)


platform :android do
  desc "Upload AAB + store listing to Internal testing as a DRAFT"
  lane :internal do
    upload_to_play_store(
      package_name: ENV["PACKAGE_NAME"],
      json_key_data: ENV["PLAY_SERVICE_ACCOUNT_JSON"],
      track: "internal",
      release_status: "draft",          # always draft: the owner presses publish
      aab: ENV["AAB_PATH"],
      skip_upload_apk: true,
      metadata_path: "fastlane/metadata/android",
      skip_upload_metadata: ENV["SKIP_METADATA"] == "true",
      skip_upload_images: ENV["SKIP_IMAGES"] == "true",
      skip_upload_screenshots: ENV["SKIP_IMAGES"] == "true",
      skip_upload_changelogs: false,
      timeout: 600                       # default is 300s; large AABs can still exceed it
    )
  end


  desc "Listing/images only, no new build"
  lane :listing do
    upload_to_play_store(
      package_name: ENV["PACKAGE_NAME"],
      json_key_data: ENV["PLAY_SERVICE_ACCOUNT_JSON"],
      track: "internal",
      skip_upload_aab: true,
      skip_upload_apk: true,
      skip_upload_changelogs: true,
      metadata_path: "fastlane/metadata/android",
      timeout: 600
    )
  end
end
```
`.github/workflows/play-internal.yml` (adapt the build step to `APP_KIND`):
```yaml
name: Play internal upload
on:
  workflow_dispatch:
    inputs:
      upload:
        description: "Upload to Play (false = only build the AAB artifact)"
        default: "true"
      listing_only:
        description: "Only upload listing and images"
        default: "false"
jobs:
  publish:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    env:
      PACKAGE_NAME: REPLACE_WITH_PACKAGE_NAME
      ANDROID_DIR: android          # folder with gradlew
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: "17" }
      - uses: ruby/setup-ruby@v1
        with: { ruby-version: "3.2", bundler-cache: true }
      # If APP_KIND is Capacitor/PWA wrapper, add actions/setup-node and the web build + `npx cap sync android` here.
      - name: Restore keystore
        run: echo "${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 -d > "$RUNNER_TEMP/upload.jks"
      - name: Build signed AAB
        working-directory: ${{ env.ANDROID_DIR }}
        env:
          KEYSTORE_PATH: ${{ runner.temp }}/upload.jks
          KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: ./gradlew bundleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: aab
          path: ${{ env.ANDROID_DIR }}/app/build/outputs/bundle/release/*.aab
      - name: Upload to Play (Internal, draft)
        if: ${{ inputs.upload == 'true' }}
        env:
          PLAY_SERVICE_ACCOUNT_JSON: ${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          AAB_PATH: ${{ env.ANDROID_DIR }}/app/build/outputs/bundle/release/app-release.aab
        run: |
          if [ "${{ inputs.listing_only }}" = "true" ]; then bundle exec fastlane android listing
          else bundle exec fastlane android internal; fi
```
The Gradle `signingConfigs.release` must read `KEYSTORE_PATH`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` from environment variables. Add that if missing. `versionCode` must increase on every upload (and stay below 2100000000): derive it from `GITHUB_RUN_NUMBER` (offset above any previously uploaded code) or bump it in the repo. `targetSdk` must meet Google Play's current target API level requirement; check it when the build is rejected.


### Store listing metadata layout
```
fastlane/metadata/android/
  he-IL/
    title.txt               (max 30 chars)
    short_description.txt   (max 80 chars)
    full_description.txt    (max 4000 chars)
    changelogs/<versionCode>.txt   (max 500 chars per language; or default.txt)
    images/
      icon.png              (512x512, 32-bit PNG with alpha, max 1024 KB)
      featureGraphic.png    (1024x500, JPEG or 24-bit PNG, no alpha)
      phoneScreenshots/1.png ... 8.png   (min 2, up to 8 per device type; JPEG or 24-bit PNG, no alpha; each side 320-3840 px; long side at most 2x the short side)
  en-US/
    (same structure)
```
- Locale folder names must match Play's codes exactly: `he-IL`, `en-US` (both are supported by supply). The language must also be added in Play Console (Grow users > Store presence > Store listings > translations) before it can be uploaded, otherwise supply errors on an unknown language.
- Write the Hebrew text natively, no machine-sounding translation, plain text, no markdown. Keep the app name consistent across locales.
- Generate screenshots from the real app (headless Chromium/Playwright against the PWA at a phone viewport such as 1080x1920 is fine) and commit them. Do not invent features in descriptions. Ask the owner to approve the descriptions before the first upload.


### Run it
1. Owner: GitHub app/web > Actions > "Play internal upload" > Run workflow. First time use `upload=false`.
2. After the manual first upload exists in Play Console, run with `upload=true`. Check Play Console > Test and release > Testing > Internal testing for the new draft release, review, then press "Send for review/Publish" manually.
3. In your reply to the owner, give the Actions run link and say what changed. Do not claim it is published; it is a draft awaiting him.


### Known pitfalls and fixes
- **Timeout on large AAB** (`Net::ReadTimeout`, `execution expired`): keep `timeout: 600` (or higher) in `upload_to_play_store` (the parameter default is 300 seconds). Re-run; also try `ENV["SUPPLY_UPLOAD_MAX_RETRIES"]="3"` (retries failed Google API calls; supported since September 2023 fastlane releases).
- **TOS_NOT_ACCEPTED** (or "Please accept the latest agreement"): the developer account owner must open Play Console and accept the pending Developer Distribution Agreement / terms. Not fixable from code. Then re-run.
- **Credential errors**: "Google Api Error: forbidden / The caller does not have permission": the service account was not invited in Play Console Users and permissions, lacks the permissions above, or the grant has not propagated yet (wait and retry; it can take up to ~24 hours). "Invalid JSON key"/parse errors: the secret was pasted truncated or wrapped; re-paste the whole file. "Google Play Android Developer API has not been used": enable the API in the Google Cloud project of the service account. Test the key anytime with `fastlane run validate_play_store_json_key json_key:...`.
- **"Package not found" / "Application not found"**: package name mismatch, app not created in Play Console, or the first AAB was not uploaded manually yet (the API cannot make the first upload).
- **"Only releases with status draft may be created on draft app"**: the app has never been published. Keep `release_status: "draft"` (already the default here).
- **"Version code N has already been used"**: raise `versionCode`.
- **Signature errors** ("signed with the wrong key"): the keystore secret is not the upload key registered in Play. Use the original keystore, or ask Google for an upload key reset.
- **Ruby on the runner**: always use `ruby/setup-ruby@v1` with `bundler-cache: true` and run `bundle exec fastlane`. Never use the system Ruby or `gem install` without Bundler. If bundler complains about the lockfile platform, run `bundle lock --add-platform x86_64-linux` and commit `Gemfile.lock`.
- **Image rejected**: wrong size, alpha channel on screenshots or feature graphic (only the icon may have alpha), or fewer than 2 phone screenshots. Fix the files and re-run the `listing` lane.
- **Changelog rejected** ("The release notes for language 'xx-XX' are too long. Limit is 500 characters."): trim the changelog file for every locale; the limit applies per language and one over-limit locale fails the whole upload.
- **Secrets**: if a secret is missing the step fails with an empty value. Tell the owner the exact secret name to add; do not ask him to paste it in chat.


### Definition of done
Workflow green, draft release visible in Internal testing with the right versionCode, listing and images present for each locale, and the owner told what remains manual.

﻿## Publishing generated videos to this YouTube channel from GitHub (universal instructions)


### Goal and division of work
- Goal: a GitHub Actions workflow uploads generated videos (committed to the repo, or produced during the run) to the owner's YouTube channel through the official YouTube Data API v3 (`videos.insert`), with title/description/tags/privacy from a small sidecar file per video. Videos default to **unlisted** (link-only); the owner (Ron) reviews them in YouTube Studio and sets them public manually. NEVER upload as public unless the sidecar or the owner says so.
- The owner works only from the Claude Code Android app (cloud GitHub sessions, no PC). Do all file work in the repo, commit to a branch, and open a PR or push as he prefers. You cannot read or set GitHub secrets. Tell the owner exactly which secrets to add and where; never ask for secret values in chat.
- No skill needs to be installed. The upload runs on the GitHub runner, either with the `yutu` GitHub Action or with a small Python script based on Google's official sample (both below). Never use Composio's YouTube upload tool: its `YOUTUBE_UPLOAD_VIDEO` has a reported bug where the file bytes never reach YouTube and the video is deleted within seconds (https://github.com/ComposioHQ/composio/issues/2954 and https://github.com/ComposioHQ/composio/issues/3547).


### Step 0: Discover, do not assume
Before writing anything, inspect the repo and fill these values. Ask the owner only for what cannot be found:
- Which Google account owns the target YouTube channel. The OAuth login below must use THAT account, which is not necessarily his default Gmail. If the channel is a Brand Account, sign in with the account that manages it and pick the brand channel during consent.
- `VIDEO_DIR` (folder where finished videos land, default `videos/`), the video formats (`.mp4` / `.mov` / `.webm`), and typical file size.
- Where videos come from: committed to git, tracked with Git LFS, downloaded from his video-generation site during the run, or generated inside the workflow. If a generator produces them, prefer generating or downloading in the workflow instead of committing large files.
- Default metadata: `categoryId` (22 = People & Blogs), default privacy (start with `unlisted`), and `madeForKids`. His growing-up videos show children: ask the owner whether they count as made for kids (COPPA); a wrong answer can get the channel penalized.
Write the discovered values at the top of `scripts/README-youtube.md` so later sessions do not re-discover them.


### One-time manual setup by the owner (about 20 minutes, all in a browser, works on his phone)
1. Google Cloud Console (console.cloud.google.com): create a project (any name, e.g. `vplus-youtube-upload`).
2. APIs & Services > Library: enable **YouTube Data API v3**.
3. APIs & Services > OAuth consent screen: user type External, fill in app name and support email, add the scope `https://www.googleapis.com/auth/youtube.upload`. Then set publishing status to **In production** (Publishing status > Publish app). With status "Testing" the refresh token expires after 7 days and uploads break weekly (https://developers.google.com/identity/protocols/oauth2#expiration, "Refresh token expiration"). Do NOT submit the app for verification; an "unverified app" warning during consent is fine for his own channel.
4. APIs & Services > Credentials > Create Credentials > OAuth client ID: application type "Web application", and add the authorized redirect URI `https://developers.google.com/oauthplayground`. Keep the client ID and client secret.
5. Get the refresh token once: open https://developers.google.com/oauthplayground, click the gear icon, check "Use your own OAuth credentials", paste the client ID and secret. In Step 1 type the scope `https://www.googleapis.com/auth/youtube.upload`, click "Authorize APIs", sign in with the Google account that owns the channel, and on the warning screen choose Advanced > continue. In Step 2 click "Exchange authorization code for tokens" and copy the **refresh token**.
6. Add the repo secrets below (GitHub repo > Settings > Secrets and variables > Actions).
Phone note: some Google Cloud Console pages are cramped on a phone. Landscape orientation or the browser's "Desktop site" toggle helps.


### GitHub repo secrets (owner adds, per repo)
- `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET`: from the OAuth client in step 4.
- `YOUTUBE_REFRESH_TOKEN`: from step 5.
- Only if using the yutu-action variant instead of the Python script: `YOUTUBE_CREDENTIAL` (the downloaded `client_secret.json`, base64-encoded) and `YOUTUBE_TOKEN` (a JSON holding the playground tokens, base64-encoded). See the variant section for the exact file shapes.
Never print secrets in logs. Never commit `client_secret*.json`, `*.token.json` or `.env`; add them to `.gitignore`. The refresh token gives permanent upload access to the channel: treat it like a password. If it ever leaks, revoke it at https://myaccount.google.com/permissions and create a new one.


### Sidecar metadata format
For each video `videos/<name>.mp4` put an optional `videos/<name>.json` next to it:
```json
{
  "title": "Adam growing up, 2015-2026",
  "description": "Made with Vplus Studio",
  "tags": ["growing up", "birthday"],
  "categoryId": "22",
  "privacyStatus": "unlisted",
  "madeForKids": false,
  "publishAt": "2026-11-20T16:00:00Z"
}
```
All fields are optional. Defaults: `title` = the file name, `description` = empty, `tags` = none, `categoryId` = "22", `privacyStatus` = "unlisted" (the owner publishes manually; set "public" to publish immediately, or "private" to keep it hidden), `madeForKids` = false. `publishAt` schedules the video: it requires `privacyStatus: "private"` and a future RFC 3339 timestamp, and YouTube publishes automatically at that time.


### Files to create
`scripts/upload_video.py` (adapted from Google's official sample https://github.com/youtube/api-samples/blob/master/python/upload_video.py):
```python
#!/usr/bin/env python3
"""Upload one video to YouTube using a stored OAuth refresh token.
Required env vars: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
Usage: python scripts/upload_video.py --file videos/clip.mp4 [--meta videos/clip.json]
"""
import argparse, json, os, sys, time
import httplib2
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload


SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]
RETRIABLE_EXCEPTIONS = (httplib2.HttpLib2Error, IOError)
MAX_RETRIES = 10


def get_youtube():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["YOUTUBE_REFRESH_TOKEN"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ["YOUTUBE_CLIENT_ID"],
        client_secret=os.environ["YOUTUBE_CLIENT_SECRET"],
        scopes=SCOPES,
    )
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


def resumable_upload(request):
    response, error, retry = None, None, 0
    while response is None:
        try:
            print("Uploading file...")
            _, response = request.next_chunk()
            if response is not None and "id" in response:
                print(f"Video id '{response['id']}' was successfully uploaded.")
                return response["id"]
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = f"Retriable HTTP error {e.resp.status}: {e.content}"
            else:
                raise
        except RETRIABLE_EXCEPTIONS as e:
            error = f"Retriable error: {e}"
        if error:
            print(error)
            retry += 1
            if retry > MAX_RETRIES:
                sys.exit("No longer attempting to retry.")
            time.sleep(2 ** retry)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--file", required=True)
    p.add_argument("--meta", default=None)
    a = p.parse_args()
    meta = {}
    if a.meta and os.path.exists(a.meta):
        meta = json.load(open(a.meta))
    status = {
        "privacyStatus": meta.get("privacyStatus", "unlisted"),
        "selfDeclaredMadeForKids": bool(meta.get("madeForKids", False)),
    }
    if meta.get("publishAt"):
        status["publishAt"] = meta["publishAt"]
        status["privacyStatus"] = "private"  # publishAt requires private
    body = {
        "snippet": {
            "title": meta.get("title") or os.path.splitext(os.path.basename(a.file))[0],
            "description": meta.get("description", ""),
            "tags": meta.get("tags", []),
            "categoryId": str(meta.get("categoryId", "22")),
        },
        "status": status,
    }
    youtube = get_youtube()
    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=MediaFileUpload(a.file, chunksize=-1, resumable=True),
    )
    video_id = resumable_upload(request)
    print(f"https://www.youtube.com/watch?v={video_id}")


if __name__ == "__main__":
    main()
```


`.github/workflows/youtube-upload.yml`:
```yaml
name: Upload videos to YouTube
on:
  workflow_dispatch:
    inputs:
      file:
        description: "Repo path to one video (empty = every un-uploaded video in videos/)"
        default: ""
  push:
    paths: ["videos/**"]
permissions:
  contents: write   # the workflow commits an .uploaded marker per video
jobs:
  upload:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    steps:
      - uses: actions/checkout@v4
        with: { lfs: true }   # harmless if LFS is unused; required if videos use Git LFS
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install google-api-python-client google-auth httplib2
      - name: Upload new videos
        env:
          YOUTUBE_CLIENT_ID: ${{ secrets.YOUTUBE_CLIENT_ID }}
          YOUTUBE_CLIENT_SECRET: ${{ secrets.YOUTUBE_CLIENT_SECRET }}
          YOUTUBE_REFRESH_TOKEN: ${{ secrets.YOUTUBE_REFRESH_TOKEN }}
        run: |
          set -euo pipefail
          shopt -s nullglob
          only="${{ inputs.file }}"
          for f in videos/*.mp4 videos/*.mov videos/*.webm; do
            if [ -n "$only" ] && [ "$f" != "$only" ]; then continue; fi
            marker="$f.uploaded"
            if [ -f "$marker" ]; then echo "skip $f (already uploaded)"; continue; fi
            meta="${f%.*}.json"; [ -f "$meta" ] || meta=""
            python scripts/upload_video.py --file "$f" ${meta:+--meta "$meta"} | tee upload.log
            url=$(grep -o 'https://www.youtube.com/watch?v=[A-Za-z0-9_-]*' upload.log | tail -1)
            echo "$url" > "$marker"
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add "$marker"
            git commit -m "Mark $f uploaded ($url)"
            git push
          done
```


Alternative for a single file, no Python: the `yutu` GitHub Action (https://github.com/eat-pray-ai/youtube-uploader, CLI repo https://github.com/eat-pray-ai/yutu):
```yaml
      - name: Upload video
        uses: eat-pray-ai/youtube-uploader@main
        with:
          credential: ${{ secrets.YOUTUBE_CREDENTIAL }}  # base64 of client_secret.json
          token: ${{ secrets.YOUTUBE_TOKEN }}            # base64 of youtube.token.json
          file: "./videos/clip.mp4"
          title: "Adam growing up"
          desc: "Made with Vplus Studio"
          tags: "growing up,birthday"
          rest-flags: "-p unlisted -g 22"   # -p privacy, -g categoryId, -y playlistId, -u thumbnail, -k forKids
```
- `client_secret.json` is downloaded in setup step 4 and base64-encoded (`base64 -w0 client_secret.json`).
- `youtube.token.json` shape: `{"access_token": "...", "token_type": "Bearer", "refresh_token": "...", "expiry": "2020-01-01T00:00:00Z"}` built from the OAuth playground tokens (an expired `expiry` just forces a refresh), then base64-encoded the same way.
- Pin the yutu version with `version:` (for example `v0.9.5`) if a newer release ever misbehaves; empty means latest.


### Run it
1. Commit a video plus its optional sidecar to `videos/` and push, or run the workflow manually with a `file` input.
2. Check the run log for the `https://www.youtube.com/watch?v=...` line, then YouTube Studio > Content for the video (private by default).
3. In your reply to the owner give the Actions run link and the video link, and say what remains manual (review and set Public in Studio, or schedule via `publishAt`). Do not claim it is public.


### Quota, privacy and the audit
- Default quota: 100 `videos.insert` calls per day, plus 10,000 units per day for the other endpoints; usage resets at midnight Pacific Time and shows on the Quotas page of the Google Cloud project (https://developers.google.com/youtube/v3/determine_quota_cost). Plenty for his volume. More quota requires passing YouTube's audit: https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits.
- Privacy: `videos.insert` defaults to public, so the workflow and sidecar always set a privacy value explicitly, defaulting to unlisted. Note: uploads from unaudited API projects used to be forced to private; Google's current reference says they are NOT restricted anymore (https://developers.google.com/youtube/v3/docs/videos/insert, checked 2026-11-06). Either way this workflow defaults to unlisted so no video goes public without the owner; if uploads ever come out locked to private, the restriction is back: publish from YouTube Studio or request the audit above.
- `madeForKids` must be truthful (COPPA). Made-for-kids videos lose comments, notifications and some other features; a wrong setting can get the channel penalized.


### Known pitfalls and fixes
- `invalid_grant` when refreshing: the refresh token expired or was revoked. Causes: consent screen still in "Testing" (7-day expiry), the Google password changed, or access revoked at myaccount.google.com/permissions. Fix: redo setup step 5, update `YOUTUBE_REFRESH_TOKEN`, and make sure the app is In production.
- "Google hasn't verified this app" warning during consent: expected for an unverified personal app; choose Advanced > continue. Removing the warning requires Google verification, not needed for his own channel.
- Push rejected because a file exceeds 100 MiB (25 MiB via web upload): GitHub's limits (https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Fixes: track videos with Git LFS (`git lfs track "videos/*.mp4"`; the workflow already checks out with `lfs: true`), attach them to a GitHub Release and download them in the run, or generate/download them inside the workflow instead of committing them.
- `quotaExceeded` / `uploadLimitExceeded`: daily cap hit (100 uploads/day, resets midnight PT) or the channel's own upload limit. Wait, or request more quota through the audit form.
- Upload stalls or `HttpError 500/502/503/504`: the script retries with exponential backoff; for large files also keep `timeout-minutes` generous.
- `publishAt` rejected: it requires `privacyStatus: "private"` and a future RFC 3339 timestamp.
- Metadata not applied: the sidecar must sit next to the video with the same base name (`videos/foo.mp4` + `videos/foo.json`).
- Secrets: a missing secret fails the step on authentication with an empty value. Tell the owner the exact secret name to add; do not ask him to paste it in chat.
- Never use Composio for the upload (silent-deletion bug, see above). Only the yutu action or the Python script.


### Definition of done
Workflow green, the video visible in YouTube Studio with the right title, description, tags and privacy, and the owner told what remains manual (review, set public, or schedule via `publishAt`).