/* ============================================================
   KOLKATA FISH, MUTTON & MORE — i18n (English / Bengali)
   Usage:
   - Static text: add data-i18n="key" to an element; its textContent
     is set from the dictionary and kept in sync on language switch.
   - Placeholders: data-i18n-placeholder="key".
   - Dynamic strings in JS: call t("key") or t("key", {name: "..."})
     for templates containing {name}-style tokens.
   - Product names: call pname(product) instead of product.name.
   ============================================================ */

const I18N = {
  en: {
    nav_fish: "Fish Market", nav_meat: "Mutton & Chicken", nav_grocery: "Bengali Grocery",
    nav_vegetables: "Vegetables", nav_sweets: "Bengali Sweets", nav_pooja: "Puja Items",
    nav_achar: "Achar & Hajmi", nav_about: "About", nav_contact: "Contact",
    nav_login: "Login", nav_cart: "Cart", nav_admin: "Admin",
    brand_tagline: "FRESH BAZAAR, DELIVERED",

    home_h1: "Fresh fish, mutton, grocery and more — priced fair, sent to your door.",
    home_lede: "Fish, mutton & chicken, Bengali grocery, vegetables, sweets, puja items and achar & hajmi — priced simply per 1 Kg, pick your quantity, and order straight over WhatsApp.",
    home_cta: "See today's fish rates",
    home_rates_title: "A FEW OF TODAY'S RATES",
    home_kolkata_heading: "The Kolkata you know",
    home_kolkata_sub: "Same city, same bazaar spirit — now on WhatsApp.",
    kb_durga_title: "Durga Puja", kb_durga_sub: "the city's biggest homecoming",
    kb_thali_title: "The Bengali thali", kb_thali_sub: "fish, rice, mishti & achar — always together",
    stalls_heading: "Shop by stall",

    fish_title: "Today's fish rates",
    fish_desc: "Priced per 1 Kg. Choose how many kilos you'd like and add to cart — you can mix items from every stall before checking out.",
    meat_title: "Cut fresh, weighed to order",
    meat_desc: "Curry cut, boneless breast and deshi country chicken — cut fresh once you order, not before.",
    grocery_title: "Store-cupboard staples",
    grocery_desc: "Rice, dal, mustard oil, spice blends and ghee — the everyday basket, priced fair and delivered.",
    vegetables_title: "Farm-fresh sabzi",
    vegetables_desc: "Potato, onion, tomato, brinjal, cauliflower and greens — picked and weighed the same morning.",
    sweets_title: "Fresh mishti, made daily",
    sweets_desc: "Roshogolla, sandesh, mishti doi and chomchom — made fresh each morning, boxed to order.",
    pooja_title: "Everything for the thala",
    pooja_desc: "Dhoop, diya, fresh flower mala and camphor — the essentials for your daily puja and festival days.",
    achar_title: "Tangy pickles & digestives",
    achar_desc: "Mango and mixed vegetable achar, lime pickle, hajmi goli and aam papad — the after-meal favourites.",

    th_item: "Item", th_price: "Price", th_qty: "Quantity",
    add_to_cart_btn: "Add to cart", out_of_stock: "Out of stock", per_prefix: "per",
    toast_added_suffix: "added —",

    cart_title: "Your cart", cart_sub: "Review your order, then send it to us on WhatsApp.",
    cart_empty: "Your cart is empty.", cart_start_link: "Start with today's fish rates →",
    th_subtotal: "Subtotal", remove_btn: "Remove", total_label: "Total",
    delivery_details_heading: "Delivery details",
    label_name: "Your name", label_whatsapp_number: "WhatsApp number (with country code)",
    label_address: "Delivery address", label_notes: "Note for us (optional)",
    notes_placeholder: "e.g. cut fish into curry pieces",
    submit_send_order: "Send order on WhatsApp →",
    how_it_works_heading: "How this works",
    how_it_works_body: "Tapping Send order on WhatsApp opens WhatsApp with your order already typed out to our store number. Just hit send there to confirm — we'll reply to confirm your order and delivery time.",
    missing_fields_toast: "Please add your name and WhatsApp number",
    order_sent_toast: "Order sent! Opening WhatsApp…",

    login_title: "Your details",
    login_sub: "Save your name and WhatsApp number once — it'll auto-fill next time you check out.",
    label_address_optional: "Delivery address (optional)",
    save_continue_btn: "Save & continue",
    welcome_msg: "You're saved as {name} ({phone}).",
    start_shopping_btn: "Start shopping", logout_btn: "Log out", saved_toast: "Saved!",

    about_title: "About Kolkata Fish, Mutton & More",
    about_p1: "Kolkata Fish, Mutton & More brings the bazaar to your door — fresh fish, mutton and chicken, Bengali grocery, vegetables, home-style sweets, puja items, and achar & hajmi — all priced simply and fairly, delivered on request.",
    about_pricing_heading: "How we price",
    about_pricing_body: "Every weight-based item is priced per 1 Kg, so there's no confusion about pack sizes — pick how many kilos you need and the total works itself out. We update prices every morning.",
    about_ordering_heading: "How ordering works",
    about_ordering_body: "Pick your items and quantities across any of our stalls, then check out once. Your order is sent to us directly on WhatsApp, and we'll confirm the order and delivery time with you there.",
    about_delivery_heading: "Where we deliver",
    about_delivery_body: "We deliver from {address}.",

    contact_title: "Contact us",
    contact_whatsapp_heading: "Reach us on WhatsApp",
    contact_whatsapp_body: "Fastest way to reach us — questions, bulk orders, or changes to an order already placed.",
    contact_whatsapp_btn: "Message us on WhatsApp",
    contact_visit_heading: "Visit / contact details",
    email_label: "Email", contact_phone_label: "Phone / WhatsApp",
    contact_hours_prefix: "Open", contact_form_heading: "Send a message",
    label_message: "Message", send_via_whatsapp_btn: "Send via WhatsApp →",

    admin_signin_sub: "Admin sign-in", admin_password_label: "Password", admin_signin_btn: "Sign in",
    admin_default_pw_note: "Default password: kolkata123 — change it under Settings after logging in.",
    side_products: "Products", side_orders: "Today's Orders", side_history: "Order History",
    side_settings: "Settings", side_view_site: "View site ↗", side_logout: "Log out",
    products_heading: "Products", export_excel_btn: "Export to Excel", import_excel_btn: "Import from Excel",
    th_photo: "Photo", th_unit: "Unit", th_price_admin: "Price ₹", th_stock: "Stock",
    add_new_item_heading: "Add new item", field_category: "Category", field_name: "Name",
    field_unit: "Unit (e.g. kg, piece)", field_step: "Qty step",
    field_price: "Price ₹ (per 1 Kg or per unit)", field_photo: "Photo",
    add_item_btn: "Add item", save_btn: "Save", delete_btn: "Delete",
    today_orders_heading: "Today's orders", export_today_btn: "Export today to Excel",
    stat_orders_today: "Orders today", stat_revenue_today: "Revenue today", stat_awaiting: "Awaiting confirmation",
    th_order: "Order", th_customer: "Customer", th_items: "Items", th_total: "Total",
    th_status: "Status", th_whatsapp: "WhatsApp", message_btn: "Message",
    history_heading: "Order history", export_month_btn: "Export month to Excel", export_all_btn: "Export all orders",
    stat_orders_month: "Orders this month", stat_revenue_month: "Revenue this month", stat_avg_order: "Average order value",
    settings_heading: "Settings", store_name_label: "Store name",
    whatsapp_number_label: "Store WhatsApp number (with country code, digits only)",
    address_label: "Address", hours_label: "Open hours", save_settings_btn: "Save settings",
    change_password_heading: "Change admin password", new_password_label: "New password",
    update_password_btn: "Update password", broadcast_heading: "Broadcast a WhatsApp message",
    broadcast_body: "Opens WhatsApp to a number of your choice with a message you type — useful for telling a regular customer about today's rate.",
    customer_number_label: "Customer WhatsApp number", message_label: "Message", open_whatsapp_btn: "Open in WhatsApp"
  },

  bn: {
    nav_fish: "মাছ বাজার", nav_meat: "খাসি ও মুরগি", nav_grocery: "বাঙালি মুদিখানা",
    nav_vegetables: "সবজি", nav_sweets: "বাঙালি মিষ্টি", nav_pooja: "পূজার সামগ্রী",
    nav_achar: "আচার ও হজমি", nav_about: "আমাদের সম্পর্কে", nav_contact: "যোগাযোগ",
    nav_login: "লগইন", nav_cart: "কার্ট", nav_admin: "অ্যাডমিন",
    brand_tagline: "টাটকা বাজার, আপনার দোরগোড়ায়",

    home_h1: "টাটকা মাছ, মাংস, মুদিখানা আর আরও অনেক কিছু — ন্যায্য দামে, আপনার দরজায়।",
    home_lede: "মাছ, খাসি ও মুরগি, বাঙালি মুদিখানা, সবজি, মিষ্টি, পূজার সামগ্রী এবং আচার ও হজমি — প্রতি ১ কেজি সহজ দামে, প্রয়োজনমতো পরিমাণ বেছে নিন এবং সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন।",
    home_cta: "আজকের মাছের দাম দেখুন",
    home_rates_title: "আজকের কিছু দাম",
    home_kolkata_heading: "আপনার চেনা কলকাতা",
    home_kolkata_sub: "একই শহর, একই বাজারের আমেজ — এখন হোয়াটসঅ্যাপে।",
    kb_durga_title: "দুর্গা পূজা", kb_durga_sub: "শহরের সবচেয়ে বড় ঘরে ফেরা",
    kb_thali_title: "বাঙালি থালা", kb_thali_sub: "মাছ, ভাত, মিষ্টি আর আচার — সবসময় একসাথে",
    stalls_heading: "বিভাগ অনুযায়ী কিনুন",

    fish_title: "আজকের মাছের দাম",
    fish_desc: "প্রতি ১ কেজি হিসেবে দাম। আপনি কত কেজি চান বেছে নিন ও কার্টে যোগ করুন — চেকআউটের আগে যেকোনো বিভাগের পণ্য একসাথে যোগ করতে পারেন।",
    meat_title: "টাটকা কাটা, অর্ডার অনুযায়ী ওজন করা",
    meat_desc: "কারি কাট, হাড় ছাড়া বুকের মাংস এবং দেশি মুরগি — অর্ডার করার পরেই টাটকা কাটা হয়, আগে থেকে নয়।",
    grocery_title: "রোজকার মুদিখানার জিনিস",
    grocery_desc: "চাল, ডাল, সরিষার তেল, মশলা আর ঘি — রোজকার প্রয়োজনীয় জিনিস, ন্যায্য দামে বাড়িতে পৌঁছে দেওয়া হয়।",
    vegetables_title: "খামার থেকে টাটকা সবজি",
    vegetables_desc: "আলু, পেঁয়াজ, টমেটো, বেগুন, ফুলকপি আর শাক-সবজি — সেদিন সকালেই তোলা ও ওজন করা।",
    sweets_title: "প্রতিদিন তৈরি টাটকা মিষ্টি",
    sweets_desc: "রসগোল্লা, সন্দেশ, মিষ্টি দই আর চমচম — প্রতিদিন সকালে তৈরি, অর্ডার অনুযায়ী বাক্সে ভরা।",
    pooja_title: "থালার জন্য সব কিছু",
    pooja_desc: "ধূপ, প্রদীপ, তাজা ফুলের মালা আর কর্পূর — আপনার নিত্য পূজা আর উৎসবের জন্য প্রয়োজনীয় সামগ্রী।",
    achar_title: "টক-ঝাল আচার ও হজমি",
    achar_desc: "আমের ও মিশ্র সবজির আচার, লেবুর আচার, হজমি গুলি আর আম পাপড় — খাবার পরের প্রিয় সামগ্রী।",

    th_item: "পণ্য", th_price: "দাম", th_qty: "পরিমাণ",
    add_to_cart_btn: "কার্টে যোগ করুন", out_of_stock: "স্টকে নেই", per_prefix: "প্রতি",
    toast_added_suffix: "যোগ হয়েছে —",

    cart_title: "আপনার কার্ট", cart_sub: "আপনার অর্ডার দেখে নিন, তারপর হোয়াটসঅ্যাপে আমাদের পাঠান।",
    cart_empty: "আপনার কার্ট খালি।", cart_start_link: "আজকের মাছের দাম দিয়ে শুরু করুন →",
    th_subtotal: "উপমোট", remove_btn: "সরান", total_label: "মোট",
    delivery_details_heading: "ডেলিভারির বিবরণ",
    label_name: "আপনার নাম", label_whatsapp_number: "হোয়াটসঅ্যাপ নম্বর (দেশের কোডসহ)",
    label_address: "ডেলিভারির ঠিকানা", label_notes: "আমাদের জন্য নোট (ঐচ্ছিক)",
    notes_placeholder: "যেমন: মাছ কারি পিস করে কাটুন",
    submit_send_order: "হোয়াটসঅ্যাপে অর্ডার পাঠান →",
    how_it_works_heading: "এটি কীভাবে কাজ করে",
    how_it_works_body: "\"হোয়াটসঅ্যাপে অর্ডার পাঠান\" চাপলে আপনার অর্ডার আগে থেকেই লেখা অবস্থায় হোয়াটসঅ্যাপ খুলবে, আমাদের দোকানের নম্বরে। সেখানে পাঠান চাপলেই অর্ডার নিশ্চিত হয়ে যাবে — আমরা অর্ডার আর ডেলিভারির সময় জানিয়ে নিশ্চিত করব।",
    missing_fields_toast: "অনুগ্রহ করে আপনার নাম ও হোয়াটসঅ্যাপ নম্বর দিন",
    order_sent_toast: "অর্ডার পাঠানো হয়েছে! হোয়াটসঅ্যাপ খোলা হচ্ছে…",

    login_title: "আপনার তথ্য",
    login_sub: "একবার আপনার নাম আর হোয়াটসঅ্যাপ নম্বর সেভ করুন — পরের বার চেকআউটে এটি নিজে থেকেই পূরণ হয়ে যাবে।",
    label_address_optional: "ডেলিভারির ঠিকানা (ঐচ্ছিক)",
    save_continue_btn: "সেভ করুন ও এগিয়ে যান",
    welcome_msg: "আপনি {name} ({phone}) হিসেবে সেভ হয়েছেন।",
    start_shopping_btn: "কেনাকাটা শুরু করুন", logout_btn: "লগ আউট", saved_toast: "সেভ হয়েছে!",

    about_title: "কলকাতা ফিশ, মাটন অ্যান্ড মোর সম্পর্কে",
    about_p1: "কলকাতা ফিশ, মাটন অ্যান্ড মোর বাজারকে নিয়ে আসে আপনার দোরগোড়ায় — টাটকা মাছ, খাসি ও মুরগি, বাঙালি মুদিখানা, সবজি, ঘরোয়া মিষ্টি, পূজার সামগ্রী এবং আচার ও হজমি — সহজ ও ন্যায্য দামে, চাহিদামতো পৌঁছে দেওয়া হয়।",
    about_pricing_heading: "আমরা কীভাবে দাম রাখি",
    about_pricing_body: "ওজন অনুযায়ী প্রতিটি জিনিসের দাম প্রতি ১ কেজি হিসেবে রাখা হয়, তাই প্যাকেটের মাপ নিয়ে কোনো বিভ্রান্তি নেই — আপনার কত কেজি দরকার তা বেছে নিন, বাকিটা নিজে থেকেই হিসেব হয়ে যাবে। আমরা প্রতিদিন সকালে দাম আপডেট করি।",
    about_ordering_heading: "অর্ডার করার নিয়ম",
    about_ordering_body: "আমাদের যেকোনো বিভাগ থেকে পণ্য আর পরিমাণ বেছে নিন, তারপর একবারে চেকআউট করুন। আপনার অর্ডার সরাসরি হোয়াটসঅ্যাপে আমাদের কাছে যাবে, এবং আমরা সেখানেই অর্ডার আর ডেলিভারির সময় নিশ্চিত করব।",
    about_delivery_heading: "আমরা কোথায় ডেলিভারি করি",
    about_delivery_body: "আমরা {address} থেকে ডেলিভারি করি।",

    contact_title: "যোগাযোগ করুন",
    contact_whatsapp_heading: "হোয়াটসঅ্যাপে আমাদের সাথে যোগাযোগ করুন",
    contact_whatsapp_body: "আমাদের সাথে যোগাযোগের দ্রুততম উপায় — প্রশ্ন, বড় অর্ডার, বা আগে দেওয়া অর্ডারে পরিবর্তনের জন্য।",
    contact_whatsapp_btn: "হোয়াটসঅ্যাপে মেসেজ করুন",
    contact_visit_heading: "ঠিকানা ও যোগাযোগ",
    email_label: "ইমেইল", contact_phone_label: "ফোন / হোয়াটসঅ্যাপ",
    contact_hours_prefix: "খোলা থাকে", contact_form_heading: "মেসেজ পাঠান",
    label_message: "মেসেজ", send_via_whatsapp_btn: "হোয়াটসঅ্যাপে পাঠান →",

    admin_signin_sub: "অ্যাডমিন সাইন-ইন", admin_password_label: "পাসওয়ার্ড", admin_signin_btn: "সাইন ইন করুন",
    admin_default_pw_note: "ডিফল্ট পাসওয়ার্ড: kolkata123 — লগইন করার পর সেটিংসে গিয়ে এটি পরিবর্তন করুন।",
    side_products: "পণ্য", side_orders: "আজকের অর্ডার", side_history: "অর্ডার ইতিহাস",
    side_settings: "সেটিংস", side_view_site: "সাইট দেখুন ↗", side_logout: "লগ আউট",
    products_heading: "পণ্য", export_excel_btn: "এক্সেলে এক্সপোর্ট করুন", import_excel_btn: "এক্সেল থেকে ইম্পোর্ট করুন",
    th_photo: "ছবি", th_unit: "একক", th_price_admin: "দাম ₹", th_stock: "স্টক",
    add_new_item_heading: "নতুন পণ্য যোগ করুন", field_category: "বিভাগ", field_name: "নাম",
    field_unit: "একক (যেমন: kg, piece)", field_step: "পরিমাণ ধাপ",
    field_price: "দাম ₹ (প্রতি ১ কেজি বা ইউনিট)", field_photo: "ছবি",
    add_item_btn: "পণ্য যোগ করুন", save_btn: "সেভ করুন", delete_btn: "মুছে ফেলুন",
    today_orders_heading: "আজকের অর্ডার", export_today_btn: "আজকের এক্সেল এক্সপোর্ট",
    stat_orders_today: "আজকের অর্ডার সংখ্যা", stat_revenue_today: "আজকের আয়", stat_awaiting: "নিশ্চিতকরণের অপেক্ষায়",
    th_order: "অর্ডার", th_customer: "গ্রাহক", th_items: "পণ্যসমূহ", th_total: "মোট",
    th_status: "অবস্থা", th_whatsapp: "হোয়াটসঅ্যাপ", message_btn: "মেসেজ",
    history_heading: "অর্ডার ইতিহাস", export_month_btn: "মাসের এক্সেল এক্সপোর্ট", export_all_btn: "সব অর্ডার এক্সপোর্ট",
    stat_orders_month: "এই মাসের অর্ডার", stat_revenue_month: "এই মাসের আয়", stat_avg_order: "গড় অর্ডার মূল্য",
    settings_heading: "সেটিংস", store_name_label: "দোকানের নাম",
    whatsapp_number_label: "দোকানের হোয়াটসঅ্যাপ নম্বর (দেশের কোডসহ, শুধু সংখ্যা)",
    address_label: "ঠিকানা", hours_label: "খোলার সময়", save_settings_btn: "সেটিংস সেভ করুন",
    change_password_heading: "অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন", new_password_label: "নতুন পাসওয়ার্ড",
    update_password_btn: "পাসওয়ার্ড আপডেট করুন", broadcast_heading: "হোয়াটসঅ্যাপ মেসেজ পাঠান",
    broadcast_body: "আপনার পছন্দের নম্বরে, আপনার লেখা মেসেজসহ হোয়াটসঅ্যাপ খোলে — নিয়মিত গ্রাহককে আজকের দাম জানাতে কাজে লাগে।",
    customer_number_label: "গ্রাহকের হোয়াটসঅ্যাপ নম্বর", message_label: "মেসেজ", open_whatsapp_btn: "হোয়াটসঅ্যাপে খুলুন"
  }
};

const KFM_LANG_KEY = "kfm_lang";

function getLang(){
  const l = localStorage.getItem(KFM_LANG_KEY);
  return l === "bn" ? "bn" : "en";
}
function setLang(lang){
  localStorage.setItem(KFM_LANG_KEY, lang === "bn" ? "bn" : "en");
  applyTranslations();
  document.dispatchEvent(new CustomEvent("kfm-lang-changed"));
}

/* t("key") or t("key", {token: "value"}) for {token}-style templates */
function t(key, vars){
  const lang = getLang();
  let str = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
  if(vars){
    Object.keys(vars).forEach(k=>{ str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]); });
  }
  return str;
}

/* Returns the product name in the current language, falling back to English. */
function pname(product){
  if(!product) return "";
  return getLang() === "bn" ? (product.name_bn || product.name) : product.name;
}

function applyTranslations(){
  const lang = getLang();
  document.documentElement.lang = lang;
  document.body && document.body.classList.toggle("lang-bn", lang === "bn");

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll(".lang-switch button").forEach(b=>{
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

function buildLangSwitch(){
  const wrap = document.createElement("div");
  wrap.className = "lang-switch";
  wrap.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="bn">বাং</button>`;
  wrap.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=> setLang(b.dataset.lang));
  });
  return wrap;
}

/* Drop a language switcher into every element with [data-lang-switch-slot] */
function mountLangSwitches(){
  document.querySelectorAll("[data-lang-switch-slot]").forEach(slot=>{
    slot.appendChild(buildLangSwitch());
  });
  applyTranslations();
}

document.addEventListener("DOMContentLoaded", mountLangSwitches);
