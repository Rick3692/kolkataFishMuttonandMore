/* ============================================================
   KOLKATA MART — admin dashboard
   Client-side only: password check happens in this browser, so
   treat it as a light lock for a trusted device/staff, not bank-
   grade security. See README.md if you need real multi-user auth.
   ============================================================ */

function showToastA(msg){ if(window.showToast) showToast(msg); else alert(msg); }

/* ---------------- LOGIN ---------------- */
function isAdminLoggedIn(){ return sessionStorage.getItem(KM_KEYS.adminAuth) === "yes"; }
function setAdminLoggedIn(v){ sessionStorage.setItem(KM_KEYS.adminAuth, v ? "yes" : "no"); }

function refreshAdminGate(){
  const loggedIn = isAdminLoggedIn();
  document.getElementById("admin-login-shell").classList.toggle("hide", loggedIn);
  document.getElementById("admin-shell").classList.toggle("hide", !loggedIn);
  if(loggedIn) initDashboard();
}

document.getElementById("admin-login-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const entered = document.getElementById("admin-pass").value;
  if(entered === getSettings().adminPassword){
    setAdminLoggedIn(true);
    refreshAdminGate();
  } else {
    alert("Wrong password.");
  }
});
document.getElementById("admin-logout").addEventListener("click", ()=>{
  setAdminLoggedIn(false);
  refreshAdminGate();
});

/* ---------------- TABS ---------------- */
document.querySelectorAll(".admin-side nav a[data-tab]").forEach(link=>{
  link.addEventListener("click", ()=>{
    document.querySelectorAll(".admin-side nav a[data-tab]").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
    document.querySelectorAll(".tabpanel").forEach(p=>p.classList.remove("active"));
    document.getElementById(link.dataset.tab).classList.add("active");
    if(link.dataset.tab === "tab-orders") renderTodayOrders();
    if(link.dataset.tab === "tab-history") renderHistory();
    if(link.dataset.tab === "tab-settings") loadSettingsForm();
  });
});

/* ---------------- PRODUCTS ---------------- */
function currentCat(){ return document.getElementById("cat-filter").value; }

function renderProductsTable(){
  const cat = currentCat();
  const q = (document.getElementById("prod-search")||{value:""}).value.trim().toLowerCase();
  const list = getProducts(cat).filter(p => !q || p.name.toLowerCase().includes(q));
  const tbody = document.getElementById("products-tbody");
  tbody.innerHTML = "";
  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="8" style="padding:20px;color:var(--ink-soft);">No items found.</td></tr>`;
    return;
  }
  list.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img class="admin-thumb" src="${p.image}" alt="">
        <input type="file" accept="image/*" data-role="image" style="display:block;font-size:.7rem;margin-top:4px;">
      </td>
      <td><input class="inline-input" style="width:140px;" data-role="name" value="${p.name}"></td>
      <td><input class="inline-input" style="width:80px;" data-role="unit" value="${p.unit}"></td>
      <td><input class="inline-input" style="width:64px;" type="number" step="0.05" min="0.05" data-role="step" value="${p.step}"></td>
      <td><input class="inline-input" type="number" step="0.01" data-role="price" value="${p.price}"></td>
      <td>
        <select data-role="stock">
          <option value="yes" ${p.inStock?"selected":""}>In stock</option>
          <option value="no" ${!p.inStock?"selected":""}>Out of stock</option>
        </select>
      </td>
      <td>
        <button class="btn small" data-act="save">Save</button>
        <button class="btn small secondary" data-act="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);

    let newImage = null;
    tr.querySelector('[data-role="image"]').addEventListener("change",(e)=>{
      const file = e.target.files[0];
      if(!file) return;
      compressImage(file).then(url => { newImage = url; tr.querySelector(".admin-thumb").src = url; });
    });

    tr.querySelector('[data-act="save"]').addEventListener("click", ()=>{
      const updated = {
        ...p,
        name: tr.querySelector('[data-role="name"]').value.trim(),
        unit: tr.querySelector('[data-role="unit"]').value.trim(),
        step: parseFloat(tr.querySelector('[data-role="step"]').value) || p.step || 1,
        price: parseFloat(tr.querySelector('[data-role="price"]').value) || 0,
        inStock: tr.querySelector('[data-role="stock"]').value === "yes",
        image: newImage || p.image
      };
      upsertProduct(updated);
      showToastA("Saved");
      renderProductsTable();
    });
    tr.querySelector('[data-act="delete"]').addEventListener("click", ()=>{
      if(confirm(`Delete "${p.name}"?`)){
        deleteProduct(p.id);
        renderProductsTable();
      }
    });
  });
}
document.getElementById("cat-filter").addEventListener("change", renderProductsTable);
document.getElementById("prod-search").addEventListener("input", renderProductsTable);

document.getElementById("add-product-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  const category = document.getElementById("np-category").value;
  const name = document.getElementById("np-name").value.trim();
  const unit = document.getElementById("np-unit").value.trim();
  const step = parseFloat(document.getElementById("np-step").value) || 1;
  const price = parseFloat(document.getElementById("np-price").value) || 0;
  const fileInput = document.getElementById("np-image");

  const finish = (imageData)=>{
    const id = category + "-" + Date.now();
    upsertProduct({ id, category, name, unit, step, price, image: imageData, inStock: true });
    document.getElementById("add-product-form").reset();
    document.getElementById("np-step").value = "0.25";
    document.getElementById("cat-filter").value = category;
    renderProductsTable();
    showToastA("Item added");
  };

  if(fileInput.files[0]){
    compressImage(fileInput.files[0]).then(finish);
  } else {
    finish(ph(name, "%23E3D6B8"));
  }
});

/* ---- Excel export / import for products (SheetJS, runs fully in-browser) ---- */
document.getElementById("export-products-btn").addEventListener("click", ()=>{
  const rows = getAllProducts().map(p=>({
    id:p.id, category:p.category, name:p.name, unit:p.unit, step:p.step,
    price:p.price, in_stock: p.inStock ? "yes":"no"
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");
  XLSX.writeFile(wb, "kolkata-mart-products.xlsx");
});

document.getElementById("import-products-input").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (evt)=>{
    const wb = XLSX.read(evt.target.result, {type:"binary"});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);
    const products = getAllProducts();
    let updated = 0, added = 0;
    rows.forEach(r=>{
      const id = String(r.id || "").trim();
      const idx = products.findIndex(p=>p.id === id);
      const rec = {
        id: id || (r.category + "-" + Date.now() + Math.floor(Math.random()*999)),
        category: r.category,
        name: r.name,
        unit: r.unit || "unit",
        step: parseFloat(r.step) || 1,
        price: parseFloat(r.price) || 0,
        inStock: String(r.in_stock).toLowerCase() !== "no",
        image: idx>=0 ? products[idx].image : ph(r.name||"?", "%23E3D6B8")
      };
      if(idx >= 0){ products[idx] = rec; updated++; } else { products.push(rec); added++; }
    });
    saveAllProducts(products);
    renderProductsTable();
    showToastA(`Import complete — ${updated} updated, ${added} added`);
    e.target.value = "";
  };
  reader.readAsBinaryString(file);
});

/* ---------------- TODAY'S ORDERS ---------------- */
function isSameDay(iso, date){
  const d = new Date(iso);
  return d.toDateString() === date.toDateString();
}

function renderTodayOrders(){
  const all = getOrders();
  const today = new Date();
  const todays = all.filter(o=>isSameDay(o.createdAt, today));

  const statsEl = document.getElementById("today-stats");
  const total = todays.reduce((s,o)=>s+o.total,0);
  statsEl.innerHTML = `
    <div class="stat"><div class="num">${todays.length}</div><div class="label">Orders today</div></div>
    <div class="stat"><div class="num">${fmtMoney(total)}</div><div class="label">Revenue today</div></div>
    <div class="stat"><div class="num">${todays.filter(o=>o.status==="New").length}</div><div class="label">Awaiting confirmation</div></div>
  `;

  const tbody = document.getElementById("today-orders-tbody");
  tbody.innerHTML = "";
  if(todays.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;color:var(--ink-soft);">No orders yet today.</td></tr>`;
    return;
  }
  todays.forEach(o=>{
    const tr = document.createElement("tr");
    const itemsText = o.items.map(it=>`${it.name} (${it.qty} ${it.unit})`).join(", ");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer.name}<br><span style="color:var(--ink-soft);font-size:.8rem;">${o.customer.phone}</span></td>
      <td style="max-width:220px;">${itemsText}</td>
      <td>${fmtMoney(o.total)}</td>
      <td>
        <select data-role="status">
          ${["New","Confirmed","Out for delivery","Delivered","Billed","Cancelled"].map(s=>`<option value="${s}" ${o.status===s?"selected":""}>${s}</option>`).join("")}
        </select>
      </td>
      <td><button class="btn small whatsapp" data-act="wa">Message</button></td>
    `;
    tbody.appendChild(tr);
    tr.querySelector('[data-role="status"]').addEventListener("change",(e)=>{
      updateOrderStatus(o.id, e.target.value);
      showToastA("Status updated");
    });
    tr.querySelector('[data-act="wa"]').addEventListener("click", ()=>{
      sendCustomerStatusMessage(o, o.status);
    });
  });
}
document.getElementById("export-today-btn").addEventListener("click", ()=>{
  const today = new Date();
  const rows = getOrders().filter(o=>isSameDay(o.createdAt, today)).map(orderToRow);
  exportOrdersToExcel(rows, `kolkata-mart-orders-${today.toISOString().slice(0,10)}.xlsx`);
});

/* ---------------- ORDER HISTORY ---------------- */
function orderToRow(o){
  return {
    order_id: o.id,
    date: new Date(o.createdAt).toLocaleString("en-IN"),
    customer_name: o.customer.name,
    customer_phone: o.customer.phone,
    address: o.customer.address || "",
    items: o.items.map(it=>`${it.name} x${it.qty}${it.unit}`).join("; "),
    total: o.total,
    status: o.status
  };
}
function exportOrdersToExcel(rows, filename){
  if(rows.length === 0){ showToastA("No orders to export"); return; }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, filename);
}

function renderHistory(){
  const monthInput = document.getElementById("history-month");
  if(!monthInput.value){
    const now = new Date();
    monthInput.value = now.toISOString().slice(0,7);
  }
  const [y,m] = monthInput.value.split("-").map(Number);
  const all = getOrders();
  const inMonth = all.filter(o=>{
    const d = new Date(o.createdAt);
    return d.getFullYear() === y && (d.getMonth()+1) === m;
  });

  const total = inMonth.reduce((s,o)=>s+o.total,0);
  document.getElementById("month-stats").innerHTML = `
    <div class="stat"><div class="num">${inMonth.length}</div><div class="label">Orders this month</div></div>
    <div class="stat"><div class="num">${fmtMoney(total)}</div><div class="label">Revenue this month</div></div>
    <div class="stat"><div class="num">${inMonth.length? fmtMoney(total/inMonth.length):"₹0"}</div><div class="label">Average order value</div></div>
  `;

  const tbody = document.getElementById("history-tbody");
  tbody.innerHTML = "";
  if(inMonth.length === 0){
    tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;color:var(--ink-soft);">No orders in this month.</td></tr>`;
    return;
  }
  inMonth.forEach(o=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
      <td>${o.customer.name}</td>
      <td style="max-width:220px;">${o.items.map(it=>it.name+" x"+it.qty).join(", ")}</td>
      <td>${fmtMoney(o.total)}</td>
      <td>${o.status}</td>
    `;
    tbody.appendChild(tr);
  });
}
document.getElementById("history-month").addEventListener("change", renderHistory);
document.getElementById("export-history-btn").addEventListener("click", ()=>{
  const monthInput = document.getElementById("history-month");
  const [y,m] = monthInput.value.split("-").map(Number);
  const rows = getOrders().filter(o=>{
    const d = new Date(o.createdAt);
    return d.getFullYear()===y && (d.getMonth()+1)===m;
  }).map(orderToRow);
  exportOrdersToExcel(rows, `kolkata-mart-orders-${monthInput.value}.xlsx`);
});
document.getElementById("export-all-btn").addEventListener("click", ()=>{
  exportOrdersToExcel(getOrders().map(orderToRow), "kolkata-mart-orders-all.xlsx");
});

/* ---------------- SETTINGS ---------------- */
function loadSettingsForm(){
  const s = getSettings();
  document.getElementById("s-name").value = s.storeName;
  document.getElementById("s-whatsapp").value = s.whatsappNumber;
  document.getElementById("s-address").value = s.address;
  document.getElementById("s-hours").value = s.openHours;
}
document.getElementById("settings-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  saveSettings({
    ...getSettings(),
    storeName: document.getElementById("s-name").value.trim(),
    whatsappNumber: waDigitsOnly(document.getElementById("s-whatsapp").value),
    address: document.getElementById("s-address").value.trim(),
    openHours: document.getElementById("s-hours").value.trim()
  });
  showToastA("Settings saved");
});
document.getElementById("password-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  const pass = document.getElementById("new-pass").value;
  if(pass.length < 4){ alert("Use at least 4 characters."); return; }
  saveSettings({...getSettings(), adminPassword: pass});
  document.getElementById("password-form").reset();
  showToastA("Password updated");
});
document.getElementById("broadcast-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  const number = document.getElementById("b-number").value.trim();
  const message = document.getElementById("b-message").value.trim();
  window.open(waLink(number, message), "_blank");
});


/* Shrinks an uploaded photo (max 480 px, JPEG) so the published catalog stays small and fast. */
function compressImage(file, max){
  max = max || 480;
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        const ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        resolve(cv.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(fr.result);
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* ---------------- PUBLISH TO WEBSITE (GitHub) ---------------- */
const getGh = () => Object.assign({ owner:"", repo:"", branch:"main", path:"data/catalog.js", token:"" }, kmRead(KM_KEYS.ghCfg, {}));

function refreshPublishUI(){
  const dirty = isDirty(), pv = publishedVersion();
  document.getElementById("publish-banner").classList.toggle("hide", !dirty);
  const st = document.getElementById("publish-status");
  st.className = "notice" + (dirty ? "" : " info");
  st.innerHTML = dirty
    ? "<b>You have unpublished changes.</b> Customers still see the last published version."
    : "Everything here matches the published website" + (pv ? " (published " + new Date(pv).toLocaleString("en-IN") + ")." : ".");
}
function toB64(str){
  const bytes = new TextEncoder().encode(str); let bin = "";
  for(let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
async function publishNow(){
  const g = getGh();
  if(!g.owner || !g.repo || !g.token){ alert("Fill in the GitHub connection below and press 'Save connection' first."); showSettingsTab(); return; }
  const btns = document.querySelectorAll("#publish-now, #publish-now-top");
  btns.forEach(b => { b.disabled = true; });
  try{
    const f = buildCatalogFile();
    const api = `https://api.github.com/repos/${encodeURIComponent(g.owner)}/${encodeURIComponent(g.repo)}/contents/${g.path.split("/").map(encodeURIComponent).join("/")}`;
    const headers = { "Authorization":"Bearer " + g.token, "Accept":"application/vnd.github+json", "X-GitHub-Api-Version":"2022-11-28" };
    let sha;
    const cur = await fetch(api + "?ref=" + encodeURIComponent(g.branch), { headers, cache:"no-store" });
    if(cur.ok) sha = (await cur.json()).sha;
    else if(cur.status !== 404) throw new Error(cur.status === 401 ? "GitHub rejected the token (401). Check it is correct and not expired." : cur.status === 403 || cur.status === 404 ? "No access (" + cur.status + ")" : "GitHub error " + cur.status);
    const put = await fetch(api, { method:"PUT", cache:"no-store", headers:Object.assign({ "Content-Type":"application/json" }, headers),
      body: JSON.stringify({ message:"Update catalog from Admin (" + f.version + ")", content:toB64(f.text), branch:g.branch, sha }) });
    if(!put.ok){
      let msg = "GitHub error " + put.status; try{ msg = (await put.json()).message || msg; }catch(e){}
      throw new Error(put.status === 404 ? "Repository, branch or path not found — or the token has no access to this repository. (" + msg + ")" : msg);
    }
    markPublished(f.version);
    refreshPublishUI();
    showToastA("Published! Visitors will see it in a few minutes.");
  }catch(err){
    alert("Could not publish:\n" + err.message + "\n\nTip: you can also use 'Download catalog.js' and upload that file to the repo on github.com.");
  }finally{ btns.forEach(b => { b.disabled = false; }); }
}
function showSettingsTab(){ document.querySelector('.admin-side nav a[data-tab="tab-settings"]').click(); }

document.getElementById("gh-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  kmWrite(KM_KEYS.ghCfg, {
    owner:document.getElementById("gh-owner").value.trim(), repo:document.getElementById("gh-repo").value.trim(),
    branch:document.getElementById("gh-branch").value.trim() || "main",
    path:(document.getElementById("gh-path").value.trim() || "data/catalog.js").replace(/^\/+/, ""),
    token:document.getElementById("gh-token").value.trim() });
  showToastA("Connection saved on this device");
});
document.getElementById("publish-now").addEventListener("click", publishNow);
document.getElementById("publish-now-top").addEventListener("click", publishNow);
document.getElementById("download-catalog").addEventListener("click", ()=>{
  const f = buildCatalogFile();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([f.text], {type:"text/javascript"})); a.download = "catalog.js"; a.click();
  alert("Upload this file to your repository at data/catalog.js (github.com → your repo → data folder → Add file → Upload files → Commit).\\n\\nAfter uploading, press OK and the website will show these changes once GitHub Pages refreshes.");
  markPublished(f.version); refreshPublishUI();
});
document.getElementById("discard-local").addEventListener("click", ()=>{
  if(!confirm("Throw away the edits made on this device and reload what is published on the website?")) return;
  discardLocalChanges(); location.reload();
});
function loadGhForm(){
  const g = getGh();
  document.getElementById("gh-owner").value = g.owner; document.getElementById("gh-repo").value = g.repo;
  document.getElementById("gh-branch").value = g.branch; document.getElementById("gh-path").value = g.path;
  document.getElementById("gh-token").value = g.token;
}
// keep the banner in sync with any edit made in this page
["saveAllProducts","saveSettings"].forEach(fn => { const orig = window[fn]; window[fn] = function(){ const r = orig.apply(this, arguments); refreshPublishUI(); return r; }; });

/* ---------------- INIT ---------------- */
function initDashboard(){
  loadGhForm(); refreshPublishUI();
  renderProductsTable();
  renderTodayOrders();
  loadSettingsForm();
}
refreshAdminGate();
