# Price-list import report

Source: `Kolkta_Price-0.xlsx` → **206 items loaded** into the shop catalog (and the billing counter).

## How the sheet was read

- **Fish / mutton / chicken** rows quoted per 250 g, 500 g or 1.5 kg were converted to a **per-kg rate** (e.g. Desi Mutton ₹650 for 500 g → ₹1,300/kg). Customers can order from **250 g** (0.25 kg) upward.
- Rows with a size **range** (e.g. Hilsa 800–1000 g, Sole 800–1000 g) are treated as the fish size, with the price as the **per-kg** rate. *Please check these three.*
- **Packed goods** (spices, dal, ghee, snacks, hajmi, attar, etc.) are loaded as **packs of the size shown** (e.g. “Gota Jeera (50 g)” ₹30). Loose rice / oil are per kg / litre.
- **Puja items** are sold as piece / pack / pair as listed.
- Items with the same name but different prices were kept separate (e.g. Red Cheli ₹10 and ₹20; Kapoor 15 g / 25 g / 50 g).
- A few obvious spelling slips were corrected (Bangladehi → Bangladeshi, Cleand → Cleaned, Punchforn → Panch Phoron, etc.).

## Please double-check these conversions

- Deshi Vetki Gota: ₹1,200 for 1.5 kg → loaded as ₹800/kg
- Ruhu Whole Curry Cut: ₹250 for 1.2 kg → loaded as ₹208/kg
- Hilsa (Diamond Harbour, Bangladeshi) and Desi Sole with size ranges → per-kg as above
- Minar Chaal Bhaja appears in both Grocery (₹120) and Snacks (₹200) – both kept
- “Snacks” items were placed under **Bengali Grocery** (there is no separate Snacks page yet).

## Not loaded: 63 rows with a name but **no price** in the sheet

Add a price in the sheet (or add the item in **Admin → Add new item**) and they can be loaded:

- **Grocery** (7): Gota Dhone, Atop Chaal Gudo, Madhuri Papad, Deshi Kalo Chola, Aam tel, Jhal Kasundi, Biscuat Guro
- **Pujo** (54): Shakha, Noth, Mala, Astro, Partee, Khoram, Madur, Balish, Kausason, Chamr BIG, Sada/Halud Suto, Boranaguri, Sindoor Chupri, Alta, Dorpon, Abir, Boro Chandmala, Ghoter Chandmala, Mala, Ghoter Ghamcha, Thala, Glass, Bati, Mombathi, Gachkotya, Maskalai, Ponchoksai, Kumkum, Jolset, Dosomitrika, Somied, GolaB Jol, Salu, Teekatha, Kath, Patkathi, Debikathi, Dure Ghot, Gaccha, Prodip, Dhunochi, Kanduhari, Rochanahari, Austto Kalas, Nobo Ghot, Shosorodhara, Kucho ProDip, Sora, Kolke, Muchi, Jaghari, Munlihari, Aaisora, Kajal Tara
- **Fish** (2): Crub Meet, CHITAL FISH PETI

## Not in your sheet

Vegetables (7 items) and Bengali Sweets (4 items) were not in the price list. The earlier **placeholder** items and prices were kept for those two stalls — please update them in Admin.

## Bengali names

The 206 imported items show their English names on the Bengali version of the site until a Bengali name is added.