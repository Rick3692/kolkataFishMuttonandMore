# Kolkata Fish, Mutton & More

A ready-to-use shop site: Fish, Mutton & Chicken, Bengali Grocery,
Vegetables, Bengali Sweets, Puja Items, and Achar & Hajmi — each with a
single clear price (no market-price comparison), a quantity picker
standardized to 1 Kg steps for weight-based items, a shared cart, and
WhatsApp checkout to **7670944063**. The site is bilingual (English /
বাংলা — a toggle sits in the header on every page). There's a full
Admin panel to
manage prices/photos and see orders, with Excel export/import.



## IMPORTANT — hosted on GitHub? Read PUBLISHING.md

Admin edits are saved in the browser you made them in. After hosting, press **Publish to website** in Admin
so everyone else sees your changes (one-time setup in **PUBLISHING.md**).

## Billing counter and price list (new)

- **`billing.html`** — a point-of-sale / billing app that shares this site's catalog, settings and website
  orders. See **BILLING.md**.
- **Catalog loaded from your Excel price list** (206 items) — see **PRICE_LIST_IMPORT_REPORT.md** for how rows
  were converted and the 63 rows that had no price. Weight items have a **250 g minimum** (editable per item in
  Admin → *Min qty*).
- Admin now has a **search box** and a link to Billing.

## 1. How to open it right now

Just double-click `index.html` — the whole site runs from these files,
no installation, no server, no cost. Every page works the same way when
you double-click it directly or host it online.

## 2. How to put it online (free)

Pick any one — all free:
- **GitHub Pages**: create a free GitHub account → new repository → upload
  this whole folder → Settings → Pages → turn on. You get a free
  `yourname.github.io/kolkata-fmm` link.
- **Netlify Drop**: go to app.netlify.com/drop and drag this folder in.
  Gives you a free live link in seconds, no account needed to try it.
- **Cloudflare Pages**: similar drag-and-drop free hosting.

## 3. Bilingual: English / বাংলা

Every customer-facing page (home, all 7 stalls, cart, login, about,
contact) has an **EN / বাং** toggle in the header. It:
- Switches all menus, headings, buttons, and messages
- Switches every product name to its Bengali name (e.g. "Rui (Rohu)" ↔
  "রুই মাছ") — this was typed in by hand for every item in the catalog
- Remembers your choice (stored in the browser) as you move between pages
- Formats the homepage's date in Bengali numerals when Bengali is selected

**Not yet translated:** the Admin panel (`admin.html`) — it stays in
English for now, since it's a back-office tool for staff rather than
something customers see. Let me know if you'd like that translated too;
the same toggle mechanism (`js/i18n.js`) can be extended to it.

**Adding a Bengali name for a new product you add later:** the Admin
"Add new item" form only takes one name field today. If you add a new
item there, it will show that same name in both languages until you (or
I) add a `name_bn` value for it directly in `js/store.js`.

## 4. Pricing model

Every product now shows **one price only** — no more market-price
comparison. Weight-based items (fish, mutton, chicken, rice, dal, oil,
ghee, vegetables, sweets, pickles) are standardized to **1 Kg** as the
base unit, with quantity chosen in whole-kg steps (1, 2, 3…). A few
items that genuinely aren't sold by weight — puja diyas, flower mala,
camphor, dhoop, hajmi goli, jeera goli — keep their natural unit
(piece / pack / set) since pricing incense sticks "per kg" wouldn't
make sense; everything else follows the 1 Kg standard. Admin can change
any item's price, unit, or weight step at any time.

## 5. The homepage banner, and adding photos to other pages

The homepage hero now uses your real photo of Howrah Bridge
(`assets/howrah-bridge.jpg`), with a dark gradient over it so the white
text stays readable. The "The Kolkata you know" section below it has
two more original illustrations (Durga Puja, a Bengali thali) drawn
specifically for this site — using a real photo of a specific idol on a
commercial page can raise copyright/likeness issues, so illustration
was the safer choice there.

The other pages (`fish.html`, `meat.html`, `grocery.html`,
`vegetables.html`, `sweets.html`, `pooja.html`, `achar.html`) don't have
a background photo yet. I looked for free-to-use stock photos for these,
but the results were dominated by paid stock/editorial photography
(Dreamstime, Alamy, etc.) — not something safe to put on a live business
site without buying a license. Rather than risk that, they're left with
the plain look for now.

**To add your own photo to any category page later**, it's a two-step
edit:
1. Drop your photo into the `assets/` folder, e.g. `assets/fish.jpg`.
2. In that page's HTML, find the line:
   `<section class="cat-hero">`
   and change it to:
   `<section class="cat-hero has-photo" style="background-image:url('assets/fish.jpg');">`

That's it — the dark overlay and white text styling are already built
in, so it'll match the homepage's look automatically.

## 6. How ordering works

1. Customer opens any stall page — `fish.html`, `meat.html`,
   `grocery.html`, `vegetables.html`, `sweets.html`, `pooja.html`, or
   `achar.html` — picks a quantity, taps **Add to cart**. One shared
   cart across every page.
2. On `cart.html` they enter name, WhatsApp number, and address, then
   tap **Send order on WhatsApp**.
3. This opens WhatsApp with the full order (items, quantities, total)
   already typed into a chat to your store number. They just tap **Send**.
4. The order is also saved into the Admin panel automatically (Today's
   Orders / Order History).

**Important, please read:** a plain website (with no paid service behind
it) cannot silently fire off a WhatsApp message on its own — WhatsApp
only allows this when the person on that device taps "Send" themselves.
This is normal for the free `wa.me` click-to-chat link this site uses.
If you later want the site to auto-send WhatsApp confirmations to
customers without anyone tapping Send, that needs the paid **WhatsApp
Business Platform API** (via Meta directly, or a provider like Gupshup,
Twilio, or Interakt) — a separate paid setup, not something a free
static website can do.

## 7. The Admin panel

Open `admin.html`.
- **Default password:** `kolkata123` — change it immediately under
  **Settings → Change admin password**.
- **Products tab** — pick a category (all 7, including Vegetables and
  Achar & Hajmi), edit any price/market-price/unit/stock inline and hit
  **Save**, upload a new photo per item, delete items, or add a
  brand-new item with the form at the bottom.
- **Today's Orders** — every order placed today, with a status dropdown
  and a **Message** button that opens WhatsApp to that customer with a
  status update pre-typed.
- **Order History** — pick any month to see all orders and revenue for
  that month, or export everything.
- **Excel, the way you asked for it** — "Export to Excel" and "Export
  today / month / all orders" download real `.xlsx` files you can open
  in Microsoft Excel. "Import from Excel" lets you edit prices in Excel
  (same column layout as the export) and re-upload to bulk-update prices
  — no coding needed, just Excel.
- **Broadcast** — type any WhatsApp number and message and it opens
  WhatsApp ready to send — handy for telling a regular customer today's
  rate changed.

## 8. Please read: how the "database" works here

To keep this **free and server-less** as you asked, all products and
orders are stored in the browser's own storage (`localStorage`) on
whichever device opens `admin.html`. This means:

- Changes an admin makes on their laptop **stay on that laptop's
  browser** — they won't show up on a customer's phone or a second
  staff member's computer unless you re-export/import the Excel file
  between them.
- Clearing browser data/cache on that device will erase products/orders
  stored there (Excel export is your backup — export the order history
  regularly).
- The admin password is checked in the browser only — fine for a small
  trusted team on their own devices, but not real account security.

**If you want prices and orders to update live for every visitor and
every staff member automatically (true multi-device sync), you need a
small real backend.** Since you mentioned Microsoft tools, the natural
free upgrade path is:
- Keep your product list in an **Excel file on OneDrive**, and use
  **Power Automate (free tier)** to expose it so the website reads
  live prices from that sheet, and to post new orders into another
  sheet automatically.
- Or a lightweight free database like **Google Sheets + Apps Script**,
  **Firebase (free tier)**, or **Airtable (free tier)**.

I can build that upgrade for you next if you'd like real-time sync
across every device — just say the word and which option you'd prefer.

## 9. File list

```
index.html       Home page
fish.html        Fish market rates
meat.html        Mutton & chicken
grocery.html     Bengali grocery
vegetables.html  Vegetables
sweets.html      Bengali sweets
pooja.html       Puja items
achar.html       Achar & Hajmi
cart.html        Cart + WhatsApp checkout
login.html       Customer "login" (saves name/phone for faster checkout)
about.html       About page
contact.html     Contact page (WhatsApp + form)
admin.html       Admin dashboard (password protected)
css/style.css    All styling
js/store.js      Product/cart/order data (localStorage)
js/i18n.js       English/Bengali translation dictionary + language switch
js/whatsapp.js   WhatsApp message + link building
js/billing.js    Billing / POS logic
css/billing.css  Billing styles
billing.html     Billing counter (staff)
data/catalog.js  Published catalog + shop details (written by Admin → Publish)
js/main.js       Shop-page behaviour (quantity steppers, add to cart)
js/admin.js      Admin dashboard logic + Excel import/export
assets/          Site images (currently: homepage hero photo)
```
