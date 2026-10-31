/* ============================================================
   KOLKATA MART — WhatsApp helpers
   Uses WhatsApp's free "click to chat" link (wa.me). This OPENS
   a prefilled chat — the person on that device still taps Send.
   There's no free way to fire an automatic, unattended WhatsApp
   message from a plain website (that needs the paid WhatsApp
   Business API). See README.md for that upgrade path.
   ============================================================ */

function waDigitsOnly(num){ return String(num || "").replace(/[^0-9]/g, ""); }

function waLink(number, message){
  const digits = waDigitsOnly(number);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function formatOrderMessage(order){
  const lines = [];
  lines.push(`*New order — ${order.id}*`);
  lines.push(`Store: ${getSettings().storeName}`);
  lines.push(`Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`);
  lines.push("");
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  if(order.customer.address) lines.push(`Address: ${order.customer.address}`);
  lines.push("");
  lines.push("Items:");
  order.items.forEach(it=>{
    lines.push(`• ${it.name} — ${it.qty} ${it.unit} x ₹${it.price} = ₹${(it.qty*it.price).toFixed(2)}`);
  });
  lines.push("");
  lines.push(`*Total: ₹${order.total.toFixed(2)}*`);
  if(order.notes) lines.push(`Note: ${order.notes}`);
  return lines.join("\n");
}

function formatCustomerCopy(order){
  const lines = [];
  lines.push(`Thank you for your order at ${getSettings().storeName}!`);
  lines.push(`Order ID: ${order.id}`);
  order.items.forEach(it=>{
    lines.push(`• ${it.name} — ${it.qty} ${it.unit}`);
  });
  lines.push(`Total: ₹${order.total.toFixed(2)}`);
  lines.push(`We will confirm your order on WhatsApp shortly.`);
  return lines.join("\n");
}

/* Opens WhatsApp to the STORE number with the full order prefilled.
   The customer (or the checkout page, on their behalf) taps Send. */
function sendOrderToStore(order){
  const settings = getSettings();
  const link = waLink(settings.whatsappNumber, formatOrderMessage(order));
  window.open(link, "_blank");
}

/* Opens WhatsApp addressed to the CUSTOMER's own number with a copy
   of their order, so they have it saved in their WhatsApp too. */
function sendCopyToCustomer(order){
  if(!order.customer.phone) return;
  const link = waLink(order.customer.phone, formatCustomerCopy(order));
  window.open(link, "_blank");
}

/* Used by the admin panel to message a customer about order status. */
function sendCustomerStatusMessage(order, statusText){
  const msg = `Hi ${order.customer.name}, update on your ${getSettings().storeName} order ${order.id}: ${statusText}`;
  const link = waLink(order.customer.phone, msg);
  window.open(link, "_blank");
}
