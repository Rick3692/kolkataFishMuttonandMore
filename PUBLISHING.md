# Why changes didn't show for other people — and how to publish now

## What was happening
GitHub Pages only serves files; it has no database. Admin used to save every change in **your browser's own
storage**, so only the browser you edited in could see it. Everyone else just received the original files.

## What works now
Admin has a **Publish to website** button. It writes your products, prices, photos and shop details
(address, phone, email, hours) into one file in your repository — `data/catalog.js`. Every page loads that
file first, and visitors' browsers pick up the new version automatically.

**Daily use:** change prices / add / delete items in Admin → a yellow "Unpublished changes" banner appears →
press **Publish to website**. Visitors see it after GitHub Pages refreshes (usually 1–2 minutes, sometimes up
to ~10).

## One-time setup (about 5 minutes)
1. **Upload this whole updated project to your repository** (replace the old files; make sure the new
   `data/` folder, `billing.html`, `js/`, `css/` are included). Your `index.html` should be at the top level of
   the repo (or note the folder name for step 3).
2. On github.com create a **fine-grained token**:
   *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token* →
   Repository access: **Only select repositories → your site's repo** → Permissions → Repository
   permissions → **Contents: Read and write** (nothing else) → Generate → copy it.
3. Open `admin.html` on **your site** → sign in → **Settings → Publish to website (GitHub)** → enter your GitHub
   username, repository name, branch (usually `main`), the catalog path (`data/catalog.js`, or
   `yourfolder/data/catalog.js` if the site lives in a folder) and the token → **Save connection** → **Publish now**.
4. Open the site on a phone or a private window to confirm.

No token? Use **Download catalog.js** and upload it to the repo's `data` folder through github.com
(*Add file → Upload files → Commit*). Same result, one extra step.

## Good to know
- The token is stored **only in the browser you typed it into**. Don't share it, and don't put it in any file in
  the repo. If it ever leaks, delete it on GitHub and make a new one.
- The Admin password is a convenience lock on each device, not real security — **the token is what actually
  protects your site** (nobody can change your catalog without it). Also remember a public repo means the
  catalog file (prices) is public — that's the same information customers see anyway.
- If two people edit at the same time on different devices, the last one to publish wins. Use one
  "owner" device for edits.
- **Discard my unpublished changes** (Settings) resets this device back to what's live.
- Billing and Admin on a counter computer pick up the latest published prices automatically as long as that
  computer has no unpublished edits of its own.

## What this does NOT fix: customer orders
Orders are still recorded in the browser the customer used, so **Admin → Today's orders** and **Billing → Web
orders** only show orders placed on that same device. Customer orders reach you on **WhatsApp**, which works
properly. To collect every web order in one list you need a small online database. A free option is a Google
Sheet with an Apps Script (the Microsoft equivalents need paid plans). I can add that if you want.
