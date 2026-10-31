/* ============================================================
   KOLKATA FISH, MUTTON & MORE — data layer
   Everything lives in the browser's localStorage. This is the
   free, zero-server way to make the site "dynamic": the admin
   panel writes here, the shop pages read from here.
   IMPORTANT (read the README): localStorage is per-browser, per
   device. See README.md for how to sync across devices/staff.
   ============================================================ */

const KM_KEYS = {
  products: "kfm_products_v1",
  orders: "kfm_orders_v1",
  cart: "kfm_cart_v1",
  customer: "kfm_customer_v1",
  settings: "kfm_settings_v1",
  adminAuth: "kfm_admin_auth_v1",
  catalogVer: "kfm_catalog_ver",
  dirty: "kfm_dirty",
  baseVer: "kfm_base_ver",
  ghCfg: "kfm_gh_cfg",
  bills: "kfm_bills_v1",
  billSeq: "kfm_bill_seq_v1",
  heldBills: "kfm_held_bills_v1"
};

const CATEGORIES = {
  fish:      { name: "Fish Market",        icon: "\uD83D\uDC1F", tagline: "Fresh off the boat — today's bazaar rate vs our price." },
  meat:      { name: "Mutton & Chicken",   icon: "\uD83C\uDF57", tagline: "Cut fresh to order, weighed in front of you." },
  grocery:   { name: "Bengali Grocery",    icon: "\uD83D\uDED2", tagline: "Daily rice, dal, spice and every store-cupboard staple." },
  vegetables:{ name: "Vegetables",         icon: "\uD83E\uDD66", tagline: "Farm-fresh sabzi, picked and weighed the same morning." },
  sweets:    { name: "Bengali Sweets",     icon: "\uD83E\uDDC1", tagline: "Fresh sandesh, roshogolla and mishti made the traditional way." },
  pooja:     { name: "Puja Items",         icon: "\uD83E\uDE94", tagline: "Everything for the thala — flowers, dhoop, and shongshar essentials." },
  achar:     { name: "Achar & Hajmi",      icon: "\uD83C\uDF6B", tagline: "Tangy pickles and after-meal digestives, the old-school way." }
};

const DEFAULT_SETTINGS = {
  storeName: "Kolkata Fish, Mutton & More",
  whatsappNumber: "917670944063", // country code + number, digits only
  adminPassword: "kolkata123",
  address: "Hafeezpet, Hyderabad 500049",
  email: "kolkatafishmuttonmore@gmail.com",
  openHours: "6:30 AM – 9:00 PM, all days"
};

function ph(label, bg){
  // inline placeholder image (SVG data-uri) so the site works with zero image assets
  const txt = encodeURIComponent(label.slice(0,2).toUpperCase());
  const c = bg || "%23E3D6B8";
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='${c}'/%3E%3Ctext x='50' y='58' font-size='34' text-anchor='middle' font-family='Georgia' fill='%23241A16'%3E${txt}%3C/text%3E%3C/svg%3E`;
}

const EXCEL_ITEMS = [
  ["xl-gro-001", "grocery", "Bagnapara Minicate Rice", "kg", 0.25, 85],
  ["xl-gro-002", "grocery", "Sorse Tel", "litre", 0.25, 255],
  ["xl-gro-003", "grocery", "Gota Jeera (50 g)", "pack", 1, 30],
  ["xl-gro-004", "grocery", "Panch Phoron (50 g)", "pack", 1, 25],
  ["xl-gro-005", "grocery", "Gawa Ghee (100 g)", "pack", 1, 110],
  ["xl-gro-006", "grocery", "Gobindho Bhog (450 g)", "pack", 1, 140],
  ["xl-gro-007", "grocery", "Joljeera (100 g)", "pack", 1, 50],
  ["xl-gro-008", "grocery", "Sona Mosuri Dal (450 g)", "pack", 1, 120],
  ["xl-gro-009", "grocery", "Yellow Sarsho (100 g)", "pack", 1, 30],
  ["xl-gro-010", "grocery", "Red Sarsho (50 g)", "pack", 1, 15],
  ["xl-gro-011", "grocery", "Mustard Kasundi (200 g)", "pack", 1, 49],
  ["xl-gro-012", "grocery", "Atop Chaal (450 g)", "pack", 1, 120],
  ["xl-gro-013", "grocery", "SR Dhone gudo (50 g)", "pack", 1, 22],
  ["xl-gro-014", "grocery", "SR Halud Guro (50 g)", "pack", 1, 19],
  ["xl-gro-015", "grocery", "Sunrise Lonka Guro (50 g)", "pack", 1, 31],
  ["xl-gro-016", "grocery", "Satyendra Sato (500 g)", "pack", 1, 106],
  ["xl-gro-017", "grocery", "Tadka Moong Dal (450 g)", "pack", 1, 135],
  ["xl-gro-018", "grocery", "Dulal Chandra Bhar Tal Misri (500 g)", "pack", 1, 83],
  ["xl-gro-019", "grocery", "Minar Chaal Bhaja (400 g)", "pack", 1, 120],
  ["xl-gro-020", "grocery", "Motor (450 g)", "pack", 1, 70],
  ["xl-gro-021", "grocery", "Biulir Daler Bori (100 g)", "pack", 1, 30],
  ["xl-gro-022", "grocery", "Posto (50 g)", "pack", 1, 130],
  ["xl-gro-023", "grocery", "Lal Phalli (450 g)", "pack", 1, 135],
  ["xl-gro-024", "grocery", "SR Sahahi Garam Masala (3 g)", "pack", 1, 10],
  ["xl-gro-025", "grocery", "SR Sahahi Garam Masala (50 g)", "pack", 1, 180],
  ["xl-gro-026", "grocery", "SR Kasmiri Mirchi Powder (50 g)", "pack", 1, 180],
  ["xl-gro-027", "grocery", "Khushboo Meetha Attar (25 ml)", "pack", 1, 45],
  ["xl-gro-028", "grocery", "Khushboo Meetha Attar (50 ml)", "pack", 1, 65],
  ["xl-gro-029", "grocery", "Gulab Jal (300 ml)", "pack", 1, 52],
  ["xl-gro-030", "grocery", "SR Meat Masala (50 g)", "pack", 1, 54],
  ["xl-gro-031", "grocery", "SR Machher Jhol Masala (50 g)", "pack", 1, 53],
  ["xl-gro-032", "grocery", "SR Chicken Curry Masala (50 g)", "pack", 1, 51],
  ["xl-gro-033", "grocery", "SR Biryani Masala (50 g)", "pack", 1, 55],
  ["xl-gro-034", "grocery", "SR Aloo Dum Masala (50 g)", "pack", 1, 49],
  ["xl-gro-035", "grocery", "Kolkata Chow (500 g)", "pack", 1, 75],
  ["xl-gro-036", "grocery", "SR Shukto Masala (50 g)", "pack", 1, 46],
  ["xl-gro-037", "grocery", "SR Mustard Powder (35 g)", "pack", 1, 15],
  ["xl-gro-038", "grocery", "Ghugni Mator (450 g)", "pack", 1, 72],
  ["xl-gro-039", "grocery", "Sona Moog Dal (450 g)", "pack", 1, 150],
  ["xl-gro-040", "grocery", "SR Tadka Masala (50 g)", "pack", 1, 49],
  ["xl-gro-041", "grocery", "Everest Methi (25 g)", "pack", 1, 32],
  ["xl-gro-042", "grocery", "Kalo Jeera (50 g)", "pack", 1, 30],
  ["xl-gro-043", "grocery", "Radhuni (50 g)", "pack", 1, 30],
  ["xl-gro-044", "grocery", "Sabu Dana (500 g)", "pack", 1, 70],
  ["xl-gro-045", "grocery", "Sachamoti Chira (500 g)", "pack", 1, 55],
  ["xl-gro-046", "grocery", "Tez Pata (50 g)", "pack", 1, 25],
  ["xl-gro-047", "grocery", "Prawn Papad (100 g)", "pack", 1, 130],
  ["xl-gro-048", "grocery", "Baskati Rice", "kg", 0.25, 105],
  ["xl-gro-049", "grocery", "Sabu Papad (80 g)", "pack", 1, 40],
  ["xl-gro-050", "grocery", "Jharna Ghee (250 g)", "pack", 1, 200],
  ["xl-gro-051", "grocery", "Jharna Ghee (100 g)", "pack", 1, 86],
  ["xl-gro-052", "grocery", "Chana Masala (50 g)", "pack", 1, 47],
  ["xl-gro-053", "grocery", "Origin Soya Sauce (200 g)", "pack", 1, 48],
  ["xl-gro-054", "grocery", "Gur Batasha (200 g)", "pack", 1, 70],
  ["xl-gro-055", "grocery", "Kalo Tetul (100 g)", "pack", 1, 55],
  ["xl-gro-056", "grocery", "SR Chana Masala (50 g)", "pack", 1, 47],
  ["xl-gro-057", "grocery", "Dry Halud (50 g)", "pack", 1, 25],
  ["xl-gro-058", "grocery", "Hamdard Pure Honey (250 g)", "pack", 1, 125],
  ["xl-gro-059", "grocery", "Everest Hing (25 g)", "pack", 1, 74],
  ["xl-gro-060", "grocery", "Origin Red Chilli Sauce (200 g)", "pack", 1, 50],
  ["xl-gro-061", "grocery", "Origin Green Chilli Sauce (200 g)", "pack", 1, 48],
  ["xl-gro-062", "grocery", "Dry Ginger Powder (200 g)", "pack", 1, 89],
  ["xl-gro-063", "grocery", "Origin Vinegar (350 g)", "pack", 1, 40],
  ["xl-gro-064", "grocery", "Bardhaman Chler Muri (500 g)", "pack", 1, 75],
  ["xl-gro-065", "grocery", "Khesari Dal (450 g)", "pack", 1, 65],
  ["xl-gro-066", "grocery", "Sada Batasha (50 g)", "pack", 1, 70],
  ["xl-poo-067", "pooja", "Siddhi (50 g)", "pack", 1, 70],
  ["xl-poo-068", "pooja", "Sindoor Joba (20 g)", "pack", 1, 35],
  ["xl-poo-069", "pooja", "Til", "pack", 1, 10],
  ["xl-poo-070", "pooja", "Hartuki", "piece", 1, 3],
  ["xl-poo-071", "pooja", "Pancha Sosha", "pack", 1, 10],
  ["xl-poo-072", "pooja", "Panchraratna", "pack", 1, 25],
  ["xl-poo-073", "pooja", "Aasan Anguri", "pack", 1, 15],
  ["xl-poo-074", "pooja", "Madhuporker Bati", "pack", 1, 15],
  ["xl-poo-075", "pooja", "Loha 10/20", "piece", 1, 40],
  ["xl-poo-076", "pooja", "Loha", "piece", 1, 50],
  ["xl-poo-077", "pooja", "Pola", "pair", 1, 20],
  ["xl-poo-078", "pooja", "Supari", "piece", 1, 2],
  ["xl-poo-079", "pooja", "Ayana", "piece", 1, 30],
  ["xl-poo-080", "pooja", "Chiruni", "piece", 1, 25],
  ["xl-poo-081", "pooja", "Sindoor Koyta", "piece", 1, 60],
  ["xl-poo-082", "pooja", "Natural Agaru", "piece", 1, 40],
  ["xl-poo-083", "pooja", "Poite (2 pcs)", "pack", 1, 10],
  ["xl-poo-084", "pooja", "Alta Pata", "piece", 1, 10],
  ["xl-poo-085", "pooja", "Tulo/Polte (20 pcs)", "pack", 1, 40],
  ["xl-poo-086", "pooja", "Kulo Big", "piece", 1, 349],
  ["xl-poo-087", "pooja", "HATPakha", "piece", 1, 90],
  ["xl-poo-088", "pooja", "Mahamaya Dhupkahi", "pack", 1, 30],
  ["xl-poo-089", "pooja", "Kodi (5 pcs)", "pack", 1, 20],
  ["xl-poo-090", "pooja", "Dhan (100 g)", "pack", 1, 60],
  ["xl-poo-091", "pooja", "Job (100 g)", "pack", 1, 45],
  ["xl-poo-092", "pooja", "Setsorya (50 g)", "pack", 1, 40],
  ["xl-poo-093", "pooja", "Lal Chali", "piece", 1, 10],
  ["xl-poo-094", "pooja", "Sarbsadhi", "pack", 1, 10],
  ["xl-poo-095", "pooja", "Mohessoddhi", "pack", 1, 10],
  ["xl-poo-096", "pooja", "Til Tel (50 ml)", "pack", 1, 60],
  ["xl-poo-097", "pooja", "Bishnu tel (50 ml)", "pack", 1, 70],
  ["xl-poo-098", "pooja", "Sreeghondi TEL (50 ml)", "pack", 1, 70],
  ["xl-poo-099", "pooja", "Dhuno (50 g)", "pack", 1, 45],
  ["xl-poo-100", "pooja", "Tirkathi (4 pcs)", "pack", 1, 50],
  ["xl-poo-101", "pooja", "Ganga Jol (1000 ml)", "pack", 1, 60],
  ["xl-poo-102", "pooja", "Tulsi Mala", "piece", 1, 70],
  ["xl-poo-103", "pooja", "kunki", "piece", 1, 110],
  ["xl-poo-104", "pooja", "Printed Kulo Small", "piece", 1, 239],
  ["xl-poo-105", "pooja", "White Chandan Kath (30-35 g)", "pack", 1, 439],
  ["xl-poo-106", "pooja", "Lal Chandan Gudo (20 g)", "pack", 1, 30],
  ["xl-poo-107", "pooja", "Artificial Joba Mala", "piece", 1, 170],
  ["xl-poo-108", "pooja", "Murki", "pack", 1, 80],
  ["xl-poo-109", "pooja", "Khukumani Alta (₹50)", "piece", 1, 50],
  ["xl-poo-110", "pooja", "Khukumani Alta (₹40)", "piece", 1, 40],
  ["xl-poo-111", "pooja", "Khukumani Sindur", "piece", 1, 50],
  ["xl-poo-112", "pooja", "White Chandan Gudo", "piece", 1, 50],
  ["xl-poo-113", "pooja", "Kush", "piece", 1, 5],
  ["xl-poo-114", "pooja", "Suto Sada/Halud/Lal", "bundle", 1, 15],
  ["xl-poo-115", "pooja", "Nukul Dana (100 g)", "pack", 1, 30],
  ["xl-poo-116", "pooja", "Honey For Puja (25 g)", "pack", 1, 28],
  ["xl-poo-117", "pooja", "Ghee For Puja (100 g)", "pack", 1, 80],
  ["xl-poo-118", "pooja", "Ghee For Puja (50 g)", "pack", 1, 40],
  ["xl-poo-119", "pooja", "Jute Asan", "piece", 1, 100],
  ["xl-poo-120", "pooja", "Kambol Asan", "piece", 1, 180],
  ["xl-poo-121", "pooja", "Pujo Gamcha", "piece", 1, 90],
  ["xl-poo-122", "pooja", "Khori Mati (200 g)", "pack", 1, 50],
  ["xl-poo-123", "pooja", "Red Cheli (₹10)", "piece", 1, 10],
  ["xl-poo-124", "pooja", "Sankha Pola Pair Set For Pujo", "piece", 1, 60],
  ["xl-poo-125", "pooja", "Red Cheli (₹20)", "piece", 1, 20],
  ["xl-poo-126", "pooja", "Ponchoguri", "pack", 1, 10],
  ["xl-poo-127", "pooja", "Khoi (50 g)", "pack", 1, 30],
  ["xl-poo-128", "pooja", "Ashtagandha", "piece", 1, 20],
  ["xl-poo-129", "pooja", "Sindoor For Puja", "pack", 1, 10],
  ["xl-poo-130", "pooja", "Raktojaba Alta", "piece", 1, 18],
  ["xl-poo-131", "pooja", "Kapoor (15 g)", "pack", 1, 20],
  ["xl-poo-132", "pooja", "Kapoor (25 g)", "pack", 1, 80],
  ["xl-poo-133", "pooja", "Kapoor (50 g)", "pack", 1, 140],
  ["xl-poo-134", "pooja", "Dhela Kapoor (50 g)", "pack", 1, 120],
  ["xl-poo-135", "pooja", "Maa Lakshmi Panchli (₹20)", "piece", 1, 20],
  ["xl-poo-136", "pooja", "Maa Lakshmi Panchli (₹30)", "piece", 1, 30],
  ["xl-poo-137", "pooja", "Golab Jol (200 ml)", "pack", 1, 42],
  ["xl-poo-138", "pooja", "Chameli Tel (50 ml)", "pack", 1, 70],
  ["xl-poo-139", "pooja", "Narayan Tel (50 ml)", "pack", 1, 115],
  ["xl-poo-140", "pooja", "Kesar Chandan Dhupkathi", "pack", 1, 30],
  ["xl-gro-141", "grocery", "Mina Tak Jhal Chanachur (500 g)", "pack", 1, 220],
  ["xl-gro-142", "grocery", "Mina R Dal Chanachur (500 g)", "pack", 1, 240],
  ["xl-gro-143", "grocery", "Mina Chanchur (500 g)", "pack", 1, 220],
  ["xl-gro-144", "grocery", "Mina R Bhujia (500 g)", "pack", 1, 200],
  ["xl-gro-145", "grocery", "Mina R Jhuri Badam (500 g)", "pack", 1, 200],
  ["xl-gro-146", "grocery", "Minar Nimki (500 g)", "pack", 1, 200],
  ["xl-gro-147", "grocery", "Minar Chaal Bhaja (400 g) (₹200)", "pack", 1, 200],
  ["xl-ach-148", "achar", "Banaras Pan (100 g)", "pack", 1, 120],
  ["xl-ach-149", "achar", "Ginger Slice (100 g)", "pack", 1, 120],
  ["xl-ach-150", "achar", "Ajwan (100 g)", "pack", 1, 99],
  ["xl-ach-151", "achar", "Mitha Aam (100 g)", "pack", 1, 99],
  ["xl-ach-152", "achar", "Lemon Guli (100 g)", "pack", 1, 99],
  ["xl-ach-153", "achar", "Anardana (100 g)", "pack", 1, 99],
  ["xl-ach-154", "achar", "Pudina Tablet (100 g)", "pack", 1, 99],
  ["xl-ach-155", "achar", "Mango Tablet (100 g)", "pack", 1, 99],
  ["xl-ach-156", "achar", "Misthi Kul (200 g)", "pack", 1, 120],
  ["xl-ach-157", "achar", "Chalte Achar (200 g)", "pack", 1, 140],
  ["xl-ach-158", "achar", "Tetul (200 g)", "pack", 1, 140],
  ["xl-ach-159", "achar", "Sweett Ambla", "piece", 1, 20],
  ["xl-ach-160", "achar", "Mix Fruits (200 g)", "pack", 1, 140],
  ["xl-ach-161", "achar", "Jalpai (200 g)", "pack", 1, 160],
  ["xl-ach-162", "achar", "Bel Morobba", "piece", 1, 30],
  ["xl-ach-163", "achar", "Misthi Aamra (200 g)", "pack", 1, 100],
  ["xl-ach-164", "achar", "Sweet Amloki (200 g)", "pack", 1, 170],
  ["xl-ach-165", "achar", "Red Chilli (200 g)", "pack", 1, 100],
  ["xl-fis-166", "fish", "Diamond Harbour Hilsa Cleaned & Cut (800-1000 g)", "kg", 0.25, 1500],
  ["xl-fis-167", "fish", "Bangladeshi Hilsa (1000-1500 g)", "kg", 0.25, 2400],
  ["xl-fis-168", "fish", "Desi Kachki Gross Weight", "kg", 0.25, 720],
  ["xl-fis-169", "fish", "Black Tangra", "kg", 0.25, 760],
  ["xl-fis-170", "fish", "White Tangra", "kg", 0.25, 700],
  ["xl-fis-171", "fish", "LIVE Singi Fish Cleaned & Cut", "kg", 0.25, 1400],
  ["xl-fis-172", "fish", "Kucho Chingdi", "kg", 0.25, 840],
  ["xl-fis-173", "fish", "Desi Topse Cut & Cleaned", "kg", 0.25, 1400],
  ["xl-fis-174", "fish", "Katla Bilshpur 10-15 kg Weight", "kg", 0.25, 500],
  ["xl-fis-175", "fish", "Katla Peti", "kg", 0.25, 840],
  ["xl-fis-176", "fish", "Purnia Roi Fish 5-8 Kg", "kg", 0.25, 600],
  ["xl-fis-177", "fish", "Roi Peti", "kg", 0.25, 800],
  ["xl-fis-178", "fish", "LIVE Koi", "kg", 0.25, 900],
  ["xl-fis-179", "fish", "Tiger Prawn Med", "kg", 0.25, 1000],
  ["xl-fis-180", "fish", "Desi Pabda", "kg", 0.25, 660],
  ["xl-fis-181", "fish", "Mourola Cut & Cleaned", "kg", 0.25, 920],
  ["xl-fis-182", "fish", "Desi Sole Cut & Cleaned (800-1000 g)", "kg", 0.25, 800],
  ["xl-fis-183", "fish", "Deshi Puti Gross", "kg", 0.25, 520],
  ["xl-fis-184", "fish", "Deshi Vetki Gota", "kg", 0.25, 800],
  ["xl-fis-185", "fish", "Vetki Cut Pieces With Out Head", "kg", 0.25, 1200],
  ["xl-fis-186", "fish", "Vetki Fille", "kg", 0.25, 1300],
  ["xl-fis-187", "fish", "Galda Chindgi", "kg", 0.25, 1200],
  ["xl-mea-188", "meat", "Desi Mutton", "kg", 0.25, 1300],
  ["xl-mea-189", "meat", "Duck Egg", "piece", 1, 29],
  ["xl-fis-190", "fish", "Mud Crab LIVE", "kg", 0.25, 1240],
  ["xl-fis-191", "fish", "White Pomfret Big", "kg", 0.25, 833],
  ["xl-fis-192", "fish", "Chital Gada", "kg", 0.25, 860],
  ["xl-fis-193", "fish", "Chapra Chingri", "kg", 0.25, 670],
  ["xl-fis-194", "fish", "Lote Gross Weight", "kg", 0.25, 500],
  ["xl-fis-195", "fish", "Bata Cleaned And Cut", "kg", 0.25, 500],
  ["xl-fis-196", "fish", "Boal Kata", "kg", 0.25, 840],
  ["xl-fis-197", "fish", "LIVE Sol Gross", "kg", 0.25, 900],
  ["xl-fis-198", "fish", "Ruhu Whole Curry Cut", "kg", 0.25, 208],
  ["xl-fis-199", "fish", "Parshe", "kg", 0.25, 680],
  ["xl-fis-200", "fish", "Kachki", "kg", 0.25, 640],
  ["xl-fis-201", "fish", "Folui", "kg", 0.25, 560],
  ["xl-fis-202", "fish", "Kajoli Fish", "kg", 0.25, 1440],
  ["xl-fis-203", "fish", "Aar Whole", "kg", 0.25, 900],
  ["xl-fis-204", "fish", "Gulsha Tangra", "kg", 0.25, 800],
  ["xl-mea-205", "meat", "Deshi Murgir Mangsho", "kg", 0.25, 630],
  ["xl-mea-206", "meat", "Deshi Murgir Dim", "piece", 1, 28]
];

const CAT_BG = { fish:"%23C9D6DE", meat:"%23E9CFC4", grocery:"%23E7DCC0", pooja:"%23E4E9D8", achar:"%23F0E2C4", vegetables:"%23DCE7C8", sweets:"%23F0DCE3" };

/* Catalog = items from the Kolkata price list (Excel) + vegetables & sweets
   placeholders (those two were not in the price list — edit prices in Admin). */
const DEFAULT_PRODUCTS = [
  // Vegetables & sweets — placeholder prices, not from the Excel list
  { id:"veg-01", category:"vegetables", name:"Potato (Aloo)", name_bn:"আলু", unit:"kg", step:1, price:28, image:ph("Po","%23DCE7C8"), inStock:true },
  { id:"veg-02", category:"vegetables", name:"Onion (Peyaj)", name_bn:"পেঁয়াজ", unit:"kg", step:1, price:38, image:ph("On","%23DCE7C8"), inStock:true },
  { id:"veg-03", category:"vegetables", name:"Tomato", name_bn:"টমেটো", unit:"kg", step:1, price:32, image:ph("To","%23DCE7C8"), inStock:true },
  { id:"veg-04", category:"vegetables", name:"Brinjal (Begun)", name_bn:"বেগুন", unit:"kg", step:1, price:42, image:ph("Br","%23DCE7C8"), inStock:true },
  { id:"veg-05", category:"vegetables", name:"Cauliflower (Fulkopi)", name_bn:"ফুলকপি", unit:"kg", step:1, price:70, image:ph("Ca","%23DCE7C8"), inStock:true },
  { id:"veg-06", category:"vegetables", name:"Spinach (Palak Shak)", name_bn:"পালং শাক", unit:"kg", step:1, price:40, image:ph("Sp","%23DCE7C8"), inStock:true },
  { id:"veg-07", category:"vegetables", name:"Green Chilli (Kacha Lonka)", name_bn:"কাঁচা লঙ্কা", unit:"kg", step:1, price:70, image:ph("Ch","%23DCE7C8"), inStock:true },
  { id:"swt-01", category:"sweets", name:"Roshogolla", name_bn:"রসগোল্লা", unit:"kg", step:1, price:260, image:ph("Ro","%23F0DCE3"), inStock:true },
  { id:"swt-02", category:"sweets", name:"Sandesh (Kora)", name_bn:"সন্দেশ (কোরা)", unit:"kg", step:1, price:480, image:ph("Sa","%23F0DCE3"), inStock:true },
  { id:"swt-03", category:"sweets", name:"Mishti Doi", name_bn:"মিষ্টি দই", unit:"kg", step:1, price:150, image:ph("Do","%23F0DCE3"), inStock:true },
  { id:"swt-04", category:"sweets", name:"Chomchom", name_bn:"চমচম", unit:"kg", step:1, price:380, image:ph("Ch","%23F0DCE3"), inStock:true }
].concat(EXCEL_ITEMS.map(r => ({
  id: r[0], category: r[1], name: r[2], unit: r[3], step: r[4], price: r[5],
  image: ph(r[2], CAT_BG[r[1]]), inStock: true
})));

/* Bump this whenever the built-in catalog changes. On a version change the
   built-in items are refreshed, while items added by the shop owner in
   Admin (ids ending in a timestamp) are kept. */
const CATALOG_VERSION = "2026-09-xl1";


/* ---------- shared (published) catalog ----------
   A static host can't store edits, so Admin → "Publish" writes data/catalog.js into
   the GitHub repo. Every page loads that file first (window.KFM_PUBLISHED); customers'
   browsers then adopt it whenever its version changes. The admin's own browser keeps
   a working copy and flags it "dirty" until it has been published. */
const PUBLISHED = (typeof window !== "undefined" && window.KFM_PUBLISHED) || null;
function hydrateProduct(p){
  return Object.assign({}, p, {
    image: p.image || ph(p.name || "?", CAT_BG[p.category] || "%23E3D6B8"),
    inStock: p.inStock !== false
  });
}
function markDirty(){ localStorage.setItem(KM_KEYS.dirty, "1"); }
function isDirty(){ return localStorage.getItem(KM_KEYS.dirty) === "1"; }
function publishedVersion(){ return PUBLISHED ? PUBLISHED.version : null; }
/* Builds the text of data/catalog.js from this browser's working copy. */
function buildCatalogFile(){
  const products = getAllProducts().map(p => {
    const q = Object.assign({}, p);
    if(String(q.image || "").indexOf("data:image/svg+xml") === 0) delete q.image;  // placeholders are regenerated
    return q;
  });
  const s = getSettings();
  const settings = { storeName:s.storeName, whatsappNumber:s.whatsappNumber, address:s.address, email:s.email, openHours:s.openHours };
  const version = new Date().toISOString();
  const text = "/* Written by Admin > Publish. Do not edit by hand. */\nwindow.KFM_PUBLISHED=" +
               JSON.stringify({ version, products, settings }) + ";\n";
  return { version, text };
}
function markPublished(version){
  localStorage.setItem(KM_KEYS.baseVer, version);
  localStorage.removeItem(KM_KEYS.dirty);
}
function discardLocalChanges(){
  localStorage.removeItem(KM_KEYS.dirty); localStorage.removeItem(KM_KEYS.baseVer);
  localStorage.removeItem(KM_KEYS.catalogVer);
}

function kmRead(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ return fallback; }
}
function kmWrite(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function initStore(){
  if(!localStorage.getItem(KM_KEYS.products)) kmWrite(KM_KEYS.products, DEFAULT_PRODUCTS);
  if(!localStorage.getItem(KM_KEYS.orders)) kmWrite(KM_KEYS.orders, []);
  if(!localStorage.getItem(KM_KEYS.cart)) kmWrite(KM_KEYS.cart, []);
  if(!localStorage.getItem(KM_KEYS.settings)) kmWrite(KM_KEYS.settings, DEFAULT_SETTINGS);
  if(PUBLISHED && Array.isArray(PUBLISHED.products)){
    if(!isDirty() && localStorage.getItem(KM_KEYS.baseVer) !== PUBLISHED.version){
      kmWrite(KM_KEYS.products, PUBLISHED.products.map(hydrateProduct));
      if(PUBLISHED.settings) kmWrite(KM_KEYS.settings, Object.assign({}, getSettings(), PUBLISHED.settings));  // keeps local admin password
      localStorage.setItem(KM_KEYS.baseVer, PUBLISHED.version);
    }
  } else if(localStorage.getItem(KM_KEYS.catalogVer) !== CATALOG_VERSION){
    const old = kmRead(KM_KEYS.products, []);
    const mine = old.filter(p => /-\d{10,}$/.test(String(p.id)));   // admin-created items
    kmWrite(KM_KEYS.products, DEFAULT_PRODUCTS.concat(mine));
    localStorage.setItem(KM_KEYS.catalogVer, CATALOG_VERSION);
  }
}

/* ---------- products ---------- */
function getAllProducts(){ return kmRead(KM_KEYS.products, DEFAULT_PRODUCTS); }
function getProducts(category){ return getAllProducts().filter(p => p.category === category); }
function saveAllProducts(list){ kmWrite(KM_KEYS.products, list); markDirty(); }
function upsertProduct(prod){
  const list = getAllProducts();
  const i = list.findIndex(p => p.id === prod.id);
  if(i >= 0) list[i] = prod; else list.push(prod);
  saveAllProducts(list);
}
function deleteProduct(id){
  saveAllProducts(getAllProducts().filter(p => p.id !== id));
}

/* ---------- cart ---------- */
function getCart(){ return kmRead(KM_KEYS.cart, []); }
function saveCart(cart){ kmWrite(KM_KEYS.cart, cart); updateCartBadge(); }
function addToCart(product, qty){
  const cart = getCart();
  const i = cart.findIndex(c => c.id === product.id);
  if(i >= 0){ cart[i].qty = qty; }
  else{
    cart.push({
      id: product.id, category: product.category, name: product.name, name_bn: product.name_bn || product.name,
      unit: product.unit, price: product.price, qty: qty
    });
  }
  saveCart(cart);
}
function removeFromCart(id){ saveCart(getCart().filter(c => c.id !== id)); }
function clearCart(){ saveCart([]); }
function cartTotal(){ return getCart().reduce((s,c)=> s + c.price * c.qty, 0); }
function cartCount(){ return getCart().reduce((s,c)=> s + c.qty, 0); }
function updateCartBadge(){
  document.querySelectorAll(".cart-badge").forEach(el=>{
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* ---------- customer (simple client login, no password server) ---------- */
function getCustomer(){ return kmRead(KM_KEYS.customer, null); }
function saveCustomer(c){ kmWrite(KM_KEYS.customer, c); }
function logoutCustomer(){ localStorage.removeItem(KM_KEYS.customer); }

/* ---------- settings ---------- */
function getSettings(){ return kmRead(KM_KEYS.settings, DEFAULT_SETTINGS); }
function saveSettings(s){ kmWrite(KM_KEYS.settings, s); markDirty(); }

/* ---------- orders ---------- */
function getOrders(){ return kmRead(KM_KEYS.orders, []); }
function addOrder(order){
  const orders = getOrders();
  orders.unshift(order);
  kmWrite(KM_KEYS.orders, orders);
}
function updateOrderStatus(orderId, status){
  const orders = getOrders();
  const o = orders.find(x=>x.id===orderId);
  if(o){ o.status = status; kmWrite(KM_KEYS.orders, orders); }
}

/* run on every page */
initStore();
document.addEventListener("DOMContentLoaded", updateCartBadge);
