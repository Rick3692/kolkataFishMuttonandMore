/* ============================================================
   KOLKATA FISH, MUTTON & MORE — billing (POS)
   Shares the product catalog, settings and web orders with the
   shop (js/store.js). Bills are stored in this browser's
   localStorage — use Setup → Backup regularly.
   ============================================================ */
(function(){
"use strict";

/* ---------------- helpers ---------------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const r2  = n => Math.round((Number(n) || 0) * 100) / 100;
const num = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
const money = n => "₹" + r2(n).toLocaleString("en-IN", {minimumFractionDigits:2, maximumFractionDigits:2});
const trimNum = n => String(r2(n));
const toast = m => (window.showToast ? window.showToast(m) : alert(m));
const dateKey = d => { d = new Date(d); return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); };
const fmtDT = iso => new Date(iso).toLocaleString("en-IN", {day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"});
const normPhone = p => { const d = waDigitsOnly(p); return d.length === 10 ? "91" + d : d; };

const CAT_LABEL = { fish:"Fish", meat:"Mutton/Chicken/Egg", grocery:"Grocery & Snacks", vegetables:"Vegetables", sweets:"Sweets", pooja:"Puja items", achar:"Achar & Hajmi" };
const BS_KEY = "kfm_billing_settings_v1";
const BS_DEFAULT = { taxLabel:"GST", taxRate:0, gstin:"", upi:"", paper:"80",
  footer:"Thank you! Visit again.\nধন্যবাদ! আবার আসবেন।" };
const bset = () => Object.assign({}, BS_DEFAULT, kmRead(BS_KEY, {}));
const getBills = () => kmRead(KM_KEYS.bills, []);
const saveBills = list => kmWrite(KM_KEYS.bills, list);
const isWeighable = u => /^(kg|litre|ltr|l)$/i.test(String(u || ""));

/* ---------------- sign-in (shares the Admin session) ---------------- */
let inited = false;
function gate(){
  const ok = sessionStorage.getItem(KM_KEYS.adminAuth) === "yes";
  $("#gate").classList.toggle("hide", ok);
  $("#app").classList.toggle("hide", !ok);
  if(ok && !inited){ inited = true; init(); }
}
$("#gate-form").addEventListener("submit", e => {
  e.preventDefault();
  if($("#gate-pass").value === getSettings().adminPassword){
    sessionStorage.setItem(KM_KEYS.adminAuth, "yes"); gate();
  } else alert("Wrong password.");
});
$("#logout").addEventListener("click", e => { e.preventDefault(); sessionStorage.setItem(KM_KEYS.adminAuth, "no"); location.reload(); });

/* ---------------- current bill ---------------- */
let bill = blankBill();
function blankBill(){
  return { items:[], customer:{name:"", phone:""}, discType:"amt", discVal:"", payMode:"Cash", received:"", notes:"", orderId:null };
}

function calc(b){
  const subtotal = r2(b.items.reduce((s, l) => s + l.qty * l.rate, 0));
  let disc = b.discType === "pct" ? r2(subtotal * num(b.discVal) / 100) : r2(num(b.discVal));
  disc = Math.max(0, Math.min(disc, subtotal));
  const net = r2(subtotal - disc);
  const rate = num(bset().taxRate);
  const tax = r2(net * rate / 100);
  const raw = net + tax;
  const total = Math.round(raw);
  return { subtotal, disc, net, tax, rate, roundOff: r2(total - raw), total };
}
function paymentInfo(b, t){
  let rec;
  if(b.received === "" || b.received == null) rec = b.payMode === "Credit" ? 0 : t.total;
  else rec = r2(num(b.received));
  return { received: rec, change: Math.max(0, r2(rec - t.total)), balance: Math.max(0, r2(t.total - rec)) };
}

/* ---------------- item picker ---------------- */
let cat = "all";
function renderChips(){
  const cats = ["all"].concat(Object.keys(CAT_LABEL));
  $("#chips").innerHTML = cats.map(c =>
    `<button type="button" class="chip-btn${c === cat ? " active" : ""}" data-c="${c}">${c === "all" ? "All" : CAT_LABEL[c]}</button>`).join("");
}
function matching(){
  const toks = $("#item-search").value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return getAllProducts()
    .filter(p => (cat === "all" || p.category === cat) && toks.every(t => p.name.toLowerCase().includes(t)))
    .sort((a, b) => a.name.localeCompare(b.name));
}
function renderItems(){
  const list = matching();
  $("#item-count").textContent = list.length + " item" + (list.length === 1 ? "" : "s");
  $("#item-grid").innerHTML = list.slice(0, 250).map(p =>
    `<button type="button" class="item-tile${p.inStock ? "" : " oos"}" data-id="${esc(p.id)}" title="${p.inStock ? "" : "Marked out of stock"}">
       <span class="n">${esc(p.name)}</span>
       <span class="p">${money(p.price)}<small>/${esc(p.unit)}</small></span></button>`).join("")
    || `<p class="muted">No items match. Use “+ Custom item” for anything not in the list.</p>`;
}
function addProduct(p, qty){
  const existing = bill.items.find(l => l.id === p.id && l.rate === p.price);
  if(existing){ existing.qty = r2(existing.qty + (qty || (isWeighable(p.unit) ? 1 : (p.step || 1)))); }
  else bill.items.push({ id:p.id, name:p.name, unit:p.unit, step:p.step || 1, rate:p.price,
                         qty: qty || (isWeighable(p.unit) ? 1 : (p.step || 1)) });
  renderLines();
  const i = bill.items.findIndex(l => l.id === p.id && l.rate === p.price);
  focusQty(i);
}
function focusQty(i){
  const inp = $(`#lines tr[data-i="${i}"] input.q`);
  if(inp){ inp.focus(); inp.select(); }
}
$("#item-grid").addEventListener("click", e => {
  const t = e.target.closest(".item-tile"); if(!t) return;
  const p = getAllProducts().find(x => x.id === t.dataset.id); if(p) addProduct(p);
});
$("#chips").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  cat = b.dataset.c; renderChips(); renderItems();
});
$("#item-search").addEventListener("input", renderItems);
$("#item-search").addEventListener("keydown", e => {
  if(e.key === "Enter"){ const first = matching()[0]; if(first){ addProduct(first); $("#item-search").value = ""; renderItems(); } }
  if(e.key === "Escape"){ $("#item-search").value = ""; renderItems(); }
});

/* custom item */
$("#custom-btn").addEventListener("click", () => { $("#custom-modal").classList.remove("hide"); $("#ci-name").focus(); });
$("#ci-cancel").addEventListener("click", () => $("#custom-modal").classList.add("hide"));
$("#custom-form").addEventListener("submit", e => {
  e.preventDefault();
  const qty = num($("#ci-qty").value), rate = num($("#ci-rate").value);
  if(qty <= 0 || rate < 0){ toast("Enter a quantity and rate"); return; }
  bill.items.push({ id:"custom-" + Date.now(), name:$("#ci-name").value.trim(), unit:$("#ci-unit").value.trim() || "pc", step:1, qty, rate });
  $("#custom-modal").classList.add("hide"); $("#custom-form").reset(); $("#ci-qty").value = "1"; $("#ci-unit").value = "pc";
  renderLines();
});

/* ---------------- bill lines ---------------- */
function quickButtons(l){
  if(!isWeighable(l.unit)) return "";
  const kg = /^kg$/i.test(l.unit);
  return `<span class="qk"><button type="button" data-q="0.25">${kg ? "250g" : "250ml"}</button><button type="button" data-q="0.5">${kg ? "500g" : "500ml"}</button><button type="button" data-q="1">${kg ? "1kg" : "1L"}</button></span>`;
}
function renderLines(){
  const tb = $("#lines");
  tb.innerHTML = bill.items.length ? bill.items.map((l, i) =>
    `<tr data-i="${i}">
       <td class="ln">${esc(l.name)}${quickButtons(l)}</td>
       <td><input class="q" inputmode="decimal" value="${l.qty}" aria-label="Quantity"> <span class="u">${esc(l.unit)}</span></td>
       <td><input class="r" inputmode="decimal" value="${l.rate}" aria-label="Rate"></td>
       <td class="amt">${money(l.qty * l.rate)}</td>
       <td><button class="x" type="button" title="Remove">×</button></td></tr>`).join("")
    : `<tr><td colspan="5" class="empty">Search or tap an item to start the bill</td></tr>`;
  renderTotals();
}
$("#lines").addEventListener("input", e => {
  const tr = e.target.closest("tr[data-i]"); if(!tr) return;
  const l = bill.items[+tr.dataset.i];
  if(e.target.classList.contains("q")) l.qty = num(e.target.value);
  if(e.target.classList.contains("r")) l.rate = num(e.target.value);
  tr.querySelector(".amt").textContent = money(l.qty * l.rate);
  renderTotals();
});
$("#lines").addEventListener("keydown", e => {
  if(e.key === "Enter" && e.target.tagName === "INPUT"){ e.preventDefault(); $("#item-search").focus(); }
});
$("#lines").addEventListener("click", e => {
  const tr = e.target.closest("tr[data-i]"); if(!tr) return;
  const i = +tr.dataset.i;
  if(e.target.classList.contains("x")){ bill.items.splice(i, 1); renderLines(); return; }
  const q = e.target.dataset && e.target.dataset.q;
  if(q){ bill.items[i].qty = num(q); renderLines(); focusQty(i); }
});

function renderTotals(){
  const t = calc(bill), p = paymentInfo(bill, t);
  $("#t-sub").textContent = money(t.subtotal);
  $("#t-disc").textContent = "−" + money(t.disc);
  $("#tax-row").classList.toggle("hide", !t.rate);
  $("#tax-label").textContent = `${bset().taxLabel} ${t.rate}%`;
  $("#t-tax").textContent = money(t.tax);
  $("#round-row").classList.toggle("hide", !t.roundOff);
  $("#t-round").textContent = (t.roundOff < 0 ? "−" : "+") + money(Math.abs(t.roundOff));
  $("#t-total").textContent = money(t.total);
  const ch = $("#change");
  if(!bill.items.length){ ch.textContent = ""; ch.className = "change"; }
  else if(p.balance > 0){ ch.textContent = "Balance due " + money(p.balance); ch.className = "change due"; }
  else if(p.change > 0){ ch.textContent = "Return change " + money(p.change); ch.className = "change ok"; }
  else { ch.textContent = "Paid in full"; ch.className = "change ok"; }
}

/* customer / payment inputs */
function refreshCustomerList(){
  const map = {};
  getBills().forEach(b => { if(b.customer && b.customer.name) map[b.customer.name] = b.customer.phone || map[b.customer.name] || ""; });
  getOrders().forEach(o => { if(o.customer && o.customer.name && !map[o.customer.name]) map[o.customer.name] = o.customer.phone || ""; });
  $("#cust-list").innerHTML = Object.keys(map).sort().map(n => `<option value="${esc(n)}">`).join("");
  refreshCustomerList.map = map;
}
$("#c-name").addEventListener("input", e => {
  bill.customer.name = e.target.value;
  const ph = refreshCustomerList.map && refreshCustomerList.map[e.target.value];
  if(ph && !$("#c-phone").value){ $("#c-phone").value = ph; bill.customer.phone = ph; }
});
$("#c-phone").addEventListener("input", e => bill.customer.phone = e.target.value);
$("#disc-type").addEventListener("change", e => { bill.discType = e.target.value; renderTotals(); });
$("#disc-val").addEventListener("input", e => { bill.discVal = e.target.value; renderTotals(); });
$("#received").addEventListener("input", e => { bill.received = e.target.value; renderTotals(); });
$("#notes").addEventListener("input", e => bill.notes = e.target.value);
$("#pay-modes").addEventListener("click", e => {
  const b = e.target.closest("button"); if(!b) return;
  bill.payMode = b.dataset.m;
  $$("#pay-modes button").forEach(x => x.classList.toggle("active", x === b));
  renderTotals();
});

function syncFormFromBill(){
  $("#c-name").value = bill.customer.name || ""; $("#c-phone").value = bill.customer.phone || "";
  $("#disc-type").value = bill.discType; $("#disc-val").value = bill.discVal || "";
  $("#received").value = bill.received || ""; $("#notes").value = bill.notes || "";
  $$("#pay-modes button").forEach(x => x.classList.toggle("active", x.dataset.m === bill.payMode));
  const tag = $("#order-tag");
  if(bill.orderId){ tag.textContent = "Billing web order " + bill.orderId; tag.classList.remove("hide"); } else tag.classList.add("hide");
  renderLines();
}
function resetBill(){ bill = blankBill(); syncFormFromBill(); $("#item-search").value = ""; renderItems(); $("#item-search").focus(); }

/* ---------------- save ---------------- */
function nextBillNo(){
  const key = dateKey(new Date()), seq = kmRead(KM_KEYS.billSeq, {});
  seq[key] = (seq[key] || 0) + 1;
  kmWrite(KM_KEYS.billSeq, seq);
  return "KFM-" + key.replace(/-/g, "").slice(2) + "-" + String(seq[key]).padStart(3, "0");
}
function saveBill(thenPrint){
  if(!bill.items.length){ toast("Add at least one item"); return null; }
  if(bill.items.some(l => !(l.qty > 0))){ toast("Every line needs a quantity above 0"); return null; }
  const t = calc(bill), p = paymentInfo(bill, t);
  const rec = {
    id: nextBillNo(), createdAt: new Date().toISOString(),
    customer: { name: bill.customer.name.trim(), phone: bill.customer.phone.trim() },
    items: bill.items.map(l => ({ id:l.id, name:l.name, unit:l.unit, qty:r2(l.qty), rate:r2(l.rate), amount:r2(l.qty * l.rate) })),
    subtotal: t.subtotal, discount: t.disc, discType: bill.discType, discVal: num(bill.discVal),
    taxRate: t.rate, taxLabel: bset().taxLabel, tax: t.tax, roundOff: t.roundOff, total: t.total,
    payMode: bill.payMode, received: p.received, change: p.change, balance: p.balance,
    notes: bill.notes.trim(), orderId: bill.orderId, payments: [], status: p.balance > 0 ? "due" : "paid"
  };
  const list = getBills(); list.unshift(rec); saveBills(list);
  if(bill.orderId) updateOrderStatus(bill.orderId, "Billed");
  refreshCustomerList(); updateBadges(); resetBill();
  toast("Saved " + rec.id);
  if(thenPrint){ openReceipt(rec); setTimeout(() => printReceipt(rec), 250); }
  return rec;
}
$("#save-print").addEventListener("click", () => saveBill(true));
$("#save-only").addEventListener("click", () => saveBill(false));
$("#clear-btn").addEventListener("click", () => { if(!bill.items.length || confirm("Clear this bill?")) resetBill(); });

/* ---------------- hold / recall ---------------- */
const getHeld = () => kmRead(KM_KEYS.heldBills, []);
function updateBadges(){
  const h = getHeld().length, o = pendingOrders().length;
  const hb = $("#held-badge"), ob = $("#orders-badge");
  hb.textContent = h; hb.classList.toggle("zero", !h);
  ob.textContent = o; ob.classList.toggle("zero", !o);
}
$("#hold-btn").addEventListener("click", () => {
  if(!bill.items.length){ toast("Nothing to hold"); return; }
  const h = getHeld(); h.push({ key: Date.now(), at: new Date().toISOString(), bill });
  kmWrite(KM_KEYS.heldBills, h); resetBill(); updateBadges(); toast("Bill held");
});
$("#held-btn").addEventListener("click", () => { renderHeld(); $("#held-modal").classList.remove("hide"); });
$("#held-close").addEventListener("click", () => $("#held-modal").classList.add("hide"));
function renderHeld(){
  const h = getHeld();
  $("#held-list").innerHTML = h.length ? h.map(x => {
    const t = calc(x.bill);
    return `<div class="held-row"><span>${esc(x.bill.customer.name || "Walk-in")} · ${x.bill.items.length} items · <b>${money(t.total)}</b><br><span class="muted small">${fmtDT(x.at)}</span></span>
      <span><button class="chip-btn" data-recall="${x.key}">Recall</button> <button class="chip-btn" data-del="${x.key}">✕</button></span></div>`;
  }).join("") : `<p class="muted">No held bills.</p>`;
}
$("#held-list").addEventListener("click", e => {
  const rk = e.target.dataset.recall, dk = e.target.dataset.del;
  let h = getHeld();
  if(rk){
    const x = h.find(y => String(y.key) === rk); if(!x) return;
    if(bill.items.length && !confirm("Replace the bill on screen?")) return;
    bill = x.bill; h = h.filter(y => String(y.key) !== rk); kmWrite(KM_KEYS.heldBills, h);
    syncFormFromBill(); updateBadges(); $("#held-modal").classList.add("hide");
  }
  if(dk){ kmWrite(KM_KEYS.heldBills, h.filter(y => String(y.key) !== dk)); renderHeld(); updateBadges(); }
});

/* ---------------- receipt ---------------- */
function receiptHTML(r){
  const s = getSettings(), b = bset(), a4 = b.paper === "A4";
  const rows = r.items.map(l =>
    `<tr><td>${esc(l.name)}<br><span style="font-size:.9em">${trimNum(l.qty)} ${esc(l.unit)} × ${trimNum(l.rate)}</span></td><td class="n">${r2(l.amount).toFixed(2)}</td></tr>`).join("");
  const line = (k, v, cls) => `<tr${cls ? ` class="${cls}"` : ""}><td>${k}</td><td class="n">${v}</td></tr>`;
  return `<div class="receipt ${a4 ? "a4" : "p80"}">
    <h1>${esc(s.storeName)}</h1>
    <div class="sub">${esc(s.address)}</div>
    <div class="sub">Ph/WhatsApp: ${esc(String(s.whatsappNumber).replace(/^91/, "+91 "))}${s.email ? "<br>" + esc(s.email) : ""}</div>
    ${b.gstin ? `<div class="sub">GSTIN/Lic: ${esc(b.gstin)}</div>` : ""}
    <hr>
    ${r.status === "void" ? `<div class="void">CANCELLED${r.voidReason ? " — " + esc(r.voidReason) : ""}</div>` : ""}
    <table><tr><td colspan="2" style="white-space:nowrap">Bill: <b>${esc(r.id)}</b></td></tr><tr><td colspan="2">${fmtDT(r.createdAt)}</td></tr>
    ${r.customer.name || r.customer.phone ? `<tr><td colspan="2">Customer: ${esc(r.customer.name)} ${esc(r.customer.phone)}</td></tr>` : ""}</table>
    <hr>
    <table><thead><tr><th>Item</th><th class="n">Amt ₹</th></tr></thead><tbody>${rows}</tbody></table>
    <hr>
    <table>
      ${line("Subtotal", r.subtotal.toFixed(2))}
      ${r.discount > 0 ? line("Discount" + (r.discType === "pct" ? ` (${r.discVal}%)` : ""), "−" + r.discount.toFixed(2)) : ""}
      ${r.tax > 0 ? line(`${esc(r.taxLabel)} ${r.taxRate}%`, r.tax.toFixed(2)) : ""}
      ${r.roundOff ? line("Round off", r.roundOff.toFixed(2)) : ""}
      ${line("TOTAL ₹", r.total.toFixed(2), "tot")}
      ${line("Paid by", esc(r.payMode))}
      ${r.received ? line("Received", r.received.toFixed(2)) : ""}
      ${r.change > 0 ? line("Change", r.change.toFixed(2)) : ""}
      ${r.balance > 0 ? line("<b>BALANCE DUE</b>", "<b>" + r.balance.toFixed(2) + "</b>") : ""}
    </table>
    ${r.notes ? `<hr><div>Note: ${esc(r.notes)}</div>` : ""}
    ${b.upi ? `<div class="sub" style="margin-top:6px">UPI: ${esc(b.upi)}</div>` : ""}
    <div class="foot">${esc(b.footer)}</div>
  </div>`;
}
let shown = null;
function openReceipt(r){ shown = r; $("#receipt-view").innerHTML = receiptHTML(r); $("#receipt-modal").classList.remove("hide"); }
function printReceipt(r){
  $("#print-area").innerHTML = receiptHTML(r);
  $("#page-style").textContent = bset().paper === "A4" ? "@page{size:A4;margin:12mm}" : "@page{size:80mm auto;margin:3mm}";
  window.print();
}
function billText(r){
  const s = getSettings(), L = [];
  L.push(`*${s.storeName}*`, `Bill ${r.id} — ${fmtDT(r.createdAt)}`, "");
  r.items.forEach(l => L.push(`• ${l.name} — ${trimNum(l.qty)} ${l.unit} × ₹${trimNum(l.rate)} = ₹${r2(l.amount).toFixed(2)}`));
  L.push("");
  if(r.discount > 0) L.push(`Discount: −₹${r.discount.toFixed(2)}`);
  if(r.tax > 0) L.push(`${r.taxLabel} ${r.taxRate}%: ₹${r.tax.toFixed(2)}`);
  L.push(`*Total: ₹${r.total.toFixed(2)}*`, `Paid by: ${r.payMode}`);
  if(r.balance > 0) L.push(`*Balance due: ₹${r.balance.toFixed(2)}*`);
  L.push("", bset().footer);
  return L.join("\n");
}
function whatsappBill(r){
  const phone = normPhone(r.customer.phone);
  if(!phone){ const p = prompt("Customer WhatsApp number:"); if(!p) return; r.customer.phone = p; }
  window.open(waLink(normPhone(r.customer.phone), billText(r)), "_blank");
}
$("#m-print").addEventListener("click", () => shown && printReceipt(shown));
$("#m-wa").addEventListener("click", () => shown && whatsappBill(shown));
$("#m-close").addEventListener("click", () => { $("#receipt-modal").classList.add("hide"); $("#item-search").focus(); });

/* ---------------- web orders ---------------- */
const pendingOrders = () => getOrders().filter(o => !["Billed", "Cancelled", "Delivered"].includes(o.status));
function renderOrders(){
  const all = $("#orders-all").checked;
  const list = all ? getOrders() : pendingOrders();
  $("#orders-list").innerHTML = list.length ? list.map(o => {
    const pill = `<span class="pill ${o.status === "Billed" ? "billed" : o.status === "New" ? "new" : ""}">${esc(o.status)}</span>`;
    const canBill = !["Billed", "Cancelled"].includes(o.status);
    return `<div class="ocard">
      <h4>${esc(o.customer.name)} ${pill}</h4>
      <div class="meta">${esc(o.id)} · ${fmtDT(o.createdAt)}<br>${esc(o.customer.phone)}${o.customer.address ? " · " + esc(o.customer.address) : ""}</div>
      <ul>${o.items.map(i => `<li>${esc(i.name)} — ${trimNum(i.qty)} ${esc(i.unit)} @ ₹${trimNum(i.price)}</li>`).join("")}</ul>
      ${o.notes ? `<div class="meta">Note: ${esc(o.notes)}</div>` : ""}
      <div style="margin:8px 0;"><b>Web total ${money(o.total)}</b></div>
      ${canBill ? `<button class="btn small" data-load="${esc(o.id)}">Load into bill</button>` : ""}
      <button class="btn small whatsapp" data-wa="${esc(o.id)}">WhatsApp customer</button>
    </div>`;
  }).join("") : `<p class="muted">No pending web orders.</p>`;
}
$("#orders-all").addEventListener("change", renderOrders);
$("#orders-list").addEventListener("click", e => {
  const lid = e.target.dataset.load, wid = e.target.dataset.wa;
  if(wid){ const o = getOrders().find(x => x.id === wid); if(o) sendCustomerStatusMessage(o, "we have received your order and are preparing it."); }
  if(!lid) return;
  const o = getOrders().find(x => x.id === lid); if(!o) return;
  if(bill.items.length && !confirm("Replace the bill on screen with this order?")) return;
  const prods = getAllProducts();
  bill = blankBill();
  bill.customer = { name:o.customer.name || "", phone:o.customer.phone || "" };
  bill.orderId = o.id; bill.notes = o.notes || "";
  bill.items = o.items.map(i => { const p = prods.find(x => x.id === i.id);
    return { id:i.id, name:i.name, unit:i.unit, step:p ? p.step : 1, qty:i.qty, rate:i.price }; });
  showTab("tab-new"); syncFormFromBill();
  toast("Order loaded — set the actual weights, then save");
});

/* ---------------- reports ---------------- */
let rangeFrom = dateKey(new Date()), rangeTo = rangeFrom;
function setRange(kind){
  const now = new Date(), y = new Date(now.getTime() - 864e5);
  if(kind === "today"){ rangeFrom = rangeTo = dateKey(now); }
  if(kind === "yesterday"){ rangeFrom = rangeTo = dateKey(y); }
  if(kind === "month"){ rangeFrom = dateKey(new Date(now.getFullYear(), now.getMonth(), 1)); rangeTo = dateKey(now); }
  if(kind === "all"){ rangeFrom = ""; rangeTo = ""; }
  $("#rf-from").value = rangeFrom; $("#rf-to").value = rangeTo;
  $$(".range [data-r]").forEach(b => b.classList.toggle("active", b.dataset.r === kind));
  renderReports();
}
$$(".range [data-r]").forEach(b => b.addEventListener("click", () => setRange(b.dataset.r)));
["#rf-from", "#rf-to"].forEach(s => $(s).addEventListener("change", () => {
  rangeFrom = $("#rf-from").value; rangeTo = $("#rf-to").value;
  $$(".range [data-r]").forEach(b => b.classList.remove("active")); renderReports(); }));

function billsInRange(){
  return getBills().filter(b => { const k = dateKey(b.createdAt); return (!rangeFrom || k >= rangeFrom) && (!rangeTo || k <= rangeTo); });
}
const stat = (n, l) => `<div class="stat"><div class="num">${n}</div><div class="label">${l}</div></div>`;
function renderReports(){
  const all = billsInRange(), live = all.filter(b => b.status !== "void");
  const sum = f => r2(live.reduce((s, b) => s + f(b), 0));
  const total = sum(b => b.total), due = sum(b => b.balance);
  $("#r-stats").innerHTML =
    stat(live.length, "Bills") + stat(money(total), "Sales (after discount)") +
    stat(money(sum(b => b.discount)), "Discount given") + stat(money(sum(b => b.tax)), "Tax collected") +
    stat(money(r2(total - due)), "Collected") + stat(money(due), "Pending dues");

  const modes = {};
  live.forEach(b => { modes[b.payMode] = modes[b.payMode] || {n:0, t:0}; modes[b.payMode].n++; modes[b.payMode].t += b.total; });
  $("#r-modes").innerHTML = `<tr><th>Mode</th><th class="num">Bills</th><th class="num">Amount</th></tr>` +
    (Object.keys(modes).map(m => `<tr><td>${esc(m)}</td><td class="num">${modes[m].n}</td><td class="num">${money(modes[m].t)}</td></tr>`).join("")
     || `<tr><td colspan="3" class="empty">No bills in this period</td></tr>`);

  const items = {};
  live.forEach(b => b.items.forEach(l => { const k = l.name + "|" + l.unit; items[k] = items[k] || {name:l.name, unit:l.unit, q:0, a:0}; items[k].q += l.qty; items[k].a += l.amount; }));
  const top = Object.values(items).sort((a, b) => b.a - a.a).slice(0, 15);
  $("#r-top").innerHTML = `<tr><th>Item</th><th class="num">Qty sold</th><th class="num">Amount</th></tr>` +
    (top.map(i => `<tr><td>${esc(i.name)}</td><td class="num">${trimNum(i.q)} ${esc(i.unit)}</td><td class="num">${money(i.a)}</td></tr>`).join("")
     || `<tr><td colspan="3" class="empty">—</td></tr>`);

  const dues = getBills().filter(b => b.status === "due");
  $("#r-dues").innerHTML = `<tr><th>Bill</th><th>Customer</th><th>Date</th><th class="num">Due</th><th></th></tr>` +
    (dues.map(b => `<tr><td>${esc(b.id)}</td><td>${esc(b.customer.name || "Walk-in")} ${esc(b.customer.phone)}</td><td>${fmtDT(b.createdAt)}</td><td class="num"><b>${money(b.balance)}</b></td>
       <td><button data-recv="${esc(b.id)}" data-m="Cash">Received Cash</button> <button data-recv="${esc(b.id)}" data-m="UPI">Received UPI</button>
       ${b.customer.phone ? `<button data-remind="${esc(b.id)}">Remind</button>` : ""}</td></tr>`).join("")
     || `<tr><td colspan="5" class="empty">No pending dues 🎉</td></tr>`);

  $("#r-bills").innerHTML = `<tr><th>Bill</th><th>Date</th><th>Customer</th><th class="num">Items</th><th class="num">Total</th><th>Mode</th><th>Status</th><th></th></tr>` +
    (all.map(b => `<tr><td>${esc(b.id)}</td><td>${fmtDT(b.createdAt)}</td><td>${esc(b.customer.name || "Walk-in")}</td><td class="num">${b.items.length}</td>
       <td class="num">${money(b.total)}</td><td>${esc(b.payMode)}</td><td><span class="pill ${b.status}">${b.status}</span></td>
       <td><button data-view="${esc(b.id)}">View/Print</button>${b.status !== "void" ? ` <button class="v" data-void="${esc(b.id)}">Void</button>` : ""}</td></tr>`).join("")
     || `<tr><td colspan="8" class="empty">No bills in this period</td></tr>`);
}
$("#tab-reports").addEventListener("click", e => {
  const d = e.target.dataset; if(!d) return;
  const bills = getBills();
  if(d.view){ const b = bills.find(x => x.id === d.view); if(b) openReceipt(b); }
  if(d.void){
    const b = bills.find(x => x.id === d.void); if(!b) return;
    const why = prompt(`Void bill ${b.id}? Enter a reason (e.g. wrong entry):`); if(why === null) return;
    b.status = "void"; b.voidReason = why || "voided"; saveBills(bills); renderReports(); toast("Bill voided");
  }
  if(d.recv){
    const b = bills.find(x => x.id === d.recv); if(!b) return;
    b.payments = b.payments || []; b.payments.push({ at:new Date().toISOString(), mode:d.m, amount:b.balance });
    b.received = r2(b.received + b.balance); b.balance = 0; b.status = "paid"; saveBills(bills); renderReports(); toast("Payment recorded");
  }
  if(d.remind){
    const b = bills.find(x => x.id === d.remind); if(!b) return;
    const s = getSettings();
    window.open(waLink(normPhone(b.customer.phone), `Hello ${b.customer.name || ""}, a gentle reminder from ${s.storeName}: ₹${b.balance.toFixed(2)} is pending on bill ${b.id} dated ${new Date(b.createdAt).toLocaleDateString("en-IN")}. Thank you!`), "_blank");
  }
});

$("#export-xlsx").addEventListener("click", () => {
  const list = billsInRange();
  if(!list.length){ toast("No bills in this period"); return; }
  const billRows = list.map(b => ({ Bill:b.id, Date:fmtDT(b.createdAt), Customer:b.customer.name, Phone:b.customer.phone,
    Subtotal:b.subtotal, Discount:b.discount, Tax:b.tax, RoundOff:b.roundOff, Total:b.total, PayMode:b.payMode,
    Received:b.received, Balance:b.balance, Status:b.status, WebOrder:b.orderId || "", Notes:b.notes }));
  const itemRows = [];
  list.forEach(b => b.items.forEach(l => itemRows.push({ Bill:b.id, Date:fmtDT(b.createdAt), Item:l.name, Qty:l.qty, Unit:l.unit, Rate:l.rate, Amount:l.amount, Status:b.status })));
  const name = `kfm-bills-${rangeFrom || "all"}${rangeTo && rangeTo !== rangeFrom ? "_to_" + rangeTo : ""}`;
  if(window.XLSX){
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(billRows), "Bills");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemRows), "Items");
    XLSX.writeFile(wb, name + ".xlsx");
  } else {   // offline fallback: CSV
    const cols = Object.keys(billRows[0]);
    const csv = [cols.join(",")].concat(billRows.map(r => cols.map(c => `"${String(r[c] == null ? "" : r[c]).replace(/"/g, '""')}"`).join(","))).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); a.download = name + ".csv"; a.click();
  }
});

/* ---------------- setup / backup ---------------- */
function loadSetup(){
  const b = bset();
  $("#s-taxlabel").value = b.taxLabel; $("#s-tax").value = b.taxRate; $("#s-gstin").value = b.gstin;
  $("#s-upi").value = b.upi; $("#s-paper").value = b.paper; $("#s-footer").value = b.footer;
}
$("#setup-form").addEventListener("submit", e => {
  e.preventDefault();
  kmWrite(BS_KEY, { taxLabel:$("#s-taxlabel").value.trim() || "GST", taxRate:num($("#s-tax").value), gstin:$("#s-gstin").value.trim(),
    upi:$("#s-upi").value.trim(), paper:$("#s-paper").value, footer:$("#s-footer").value });
  renderTotals(); toast("Setup saved");
});
$("#backup-btn").addEventListener("click", () => {
  const data = { app:"kfm-billing", at:new Date().toISOString(), bills:getBills(), seq:kmRead(KM_KEYS.billSeq, {}), settings:bset() };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], {type:"application/json"}));
  a.download = "kfm-billing-backup-" + dateKey(new Date()) + ".json"; a.click();
});
$("#restore-input").addEventListener("change", e => {
  const f = e.target.files[0]; if(!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try{
      const d = JSON.parse(rd.result);
      if(d.app !== "kfm-billing" || !Array.isArray(d.bills)) throw 0;
      const have = new Set(getBills().map(b => b.id));
      const add = d.bills.filter(b => !have.has(b.id));
      saveBills(getBills().concat(add).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      const seq = kmRead(KM_KEYS.billSeq, {}); Object.keys(d.seq || {}).forEach(k => seq[k] = Math.max(seq[k] || 0, d.seq[k]));
      kmWrite(KM_KEYS.billSeq, seq);
      if(d.settings) kmWrite(BS_KEY, d.settings);
      toast(`Restored ${add.length} bills`); loadSetup(); renderReports();
    } catch(err){ alert("That doesn't look like a billing backup file."); }
  };
  rd.readAsText(f); e.target.value = "";
});
$("#wipe-btn").addEventListener("click", () => {
  if(!confirm("Delete ALL saved bills and restart numbering? This cannot be undone.")) return;
  saveBills([]); kmWrite(KM_KEYS.billSeq, {}); kmWrite(KM_KEYS.heldBills, []); updateBadges(); renderReports(); toast("All bills deleted");
});

/* ---------------- tabs, shortcuts, init ---------------- */
function showTab(id){
  $$(".bill-tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === id));
  $$(".tab").forEach(t => t.classList.toggle("active", t.id === id));
  if(id === "tab-orders") renderOrders();
  if(id === "tab-reports") renderReports();
  if(id === "tab-setup") loadSetup();
  if(id === "tab-new") $("#item-search").focus();
}
$$(".bill-tabs button").forEach(b => b.addEventListener("click", () => showTab(b.dataset.tab)));
$("#orders-list").addEventListener("click", () => {});
document.addEventListener("keydown", e => {
  if(e.key === "F2"){ e.preventDefault(); showTab("tab-new"); $("#item-search").focus(); }
  if(e.key === "Enter" && (e.ctrlKey || e.metaKey) && $("#tab-new").classList.contains("active")){ e.preventDefault(); saveBill(true); }
  if(e.key === "Escape"){ $$(".modal").forEach(m => m.classList.add("hide")); }
});
window.addEventListener("storage", updateBadges);   // new web order arriving from another tab

function init(){
  renderChips(); renderItems(); refreshCustomerList(); syncFormFromBill(); updateBadges();
  setRange("today"); $("#item-search").focus();
}
gate();
})();
