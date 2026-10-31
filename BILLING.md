# Billing (POS) for Kolkata Fish, Mutton & More

Open **`billing.html`** (also linked from Admin → "🧾 Billing"). Sign in with the **same password as Admin**
(default `kolkata123` — change it in Admin → Settings).

It is part of the same web app: it reads the **same product list and prices** as the shop, the shop's address /
phone / email from Admin → Settings, and the **orders customers send from the website**.

## Making a bill
1. Press **F2**, type part of an item name (e.g. `kachki`), press **Enter** — the first match is added and the
   quantity box is selected. Type the weight (`1.5`) and press **Enter** to go back to search.
   You can also tap item tiles, or filter by stall with the chips.
2. Fish / meat / loose items show **250g · 500g · 1kg** quick buttons. **Rate** is editable on every line
   (rates change daily at the counter).
3. **+ Custom item** adds anything not in the list (carry bags, etc.).
4. Optional customer name + phone (names you have billed before auto-complete).
5. Discount in ₹ or %, pick **Cash / UPI / Card / Credit**, type the amount received to see the change.
   **Credit** (or part payment) records a **due**.
6. **Save & print** (Ctrl+Enter) prints the receipt; **Save** just stores it. From the receipt you can also
   **Send on WhatsApp** to the customer.
7. **Hold** parks a bill while you serve someone else; **Held** brings it back.

Bill numbers run `KFM-YYMMDD-001` and restart every day.

## Website orders → bills
**Web orders** lists orders customers sent from the shop. **Load into bill**, correct the real weights and rates,
save — the order is marked **Billed** in Admin automatically. **WhatsApp customer** sends a quick update.

## Reports
**Bills & reports**: pick Today / Yesterday / This month / All (or any dates) to see bills, sales, discount, tax,
collected vs pending dues, sales by payment mode and top-selling items. Reprint, **Void** (keeps a record and
removes it from totals), record **dues received**, send a WhatsApp **reminder**, and **Export Excel**
(Bills + Items sheets).

## Setup
Tax % (off by default — fresh fish and meat are normally GST-exempt, check your other items with your
accountant), GSTIN/licence and UPI ID to print, 80 mm thermal or A4 paper, footer message.
**Backup**: download a `.json` backup regularly. Bills are stored in this browser (like the rest of the app), so
use **one** counter computer for billing, and keep backups.

## Printing on a thermal printer
Choose "80 mm" in Setup, then in the browser's print dialog pick your receipt printer, set margins to *None/Minimum*
and turn off "headers and footers".

## Limits to know about
- Works offline, but data lives only in the browser on that computer (no automatic sync between devices).
- No stock counting yet (bills do not reduce stock) and no card-machine integration — Card is just recorded.
- Receipts are plain tax-invoice-style bills, not a GST-compliant e-invoice.
