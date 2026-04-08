-- Seed 6 products from REFERENCE-HOMEPAGE.jsx
INSERT INTO products (name, slug, description, short_description, price, compare_price, category, tags, weight_grams, ingredients, images, stock, is_active, is_featured) VALUES
(
  'Coffee scrub',
  'coffee-scrub',
  'Energizujúci kávový peeling, ktorý prebudí tvoju pokožku. Jemne mletá káva odstraňuje odumreté bunky a stimuluje krvný obeh. Kofeín pomáha redukovať celulitídu a zanecháva pokožku hladkú a žiarivú. Ideálny na rannú sprchu — vôňa čerstvého espressa ťa naštartuje do nového dňa.',
  'Energizujúci kávový peeling',
  18.90,
  NULL,
  'coffee',
  ARRAY['bestseller', 'vegan', 'handmade'],
  200,
  'Coffea Arabica (Coffee) Seed Powder, Cocos Nucifera (Coconut) Oil, Saccharum Officinarum (Sugar), Prunus Amygdalus Dulcis (Sweet Almond) Oil, Tocopherol (Vitamin E), Coffea Arabica Seed Extract',
  '[{"url": "", "alt": "Coffee scrub", "position": 0}]',
  50,
  true,
  true
),
(
  'Lavender oil scrub',
  'lavender-oil-scrub',
  'Upokojujúci levanduľový rituál pre telo aj myseľ. Kombinácia jemného morského soľného peelingového základu s esenciálnym olejom z pravej francúzskej levandule. Uvoľňuje napätie, hydratuje pokožku a pripravuje ťa na pokojný spánok.',
  'Upokojujúci levanduľový rituál',
  22.90,
  NULL,
  'oil',
  ARRAY['novinka', 'organic', 'handmade'],
  150,
  'Maris Sal (Sea Salt), Prunus Amygdalus Dulcis (Sweet Almond) Oil, Lavandula Angustifolia (Lavender) Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Tocopherol (Vitamin E), Lavandula Angustifolia Flower Extract',
  '[{"url": "", "alt": "Lavender oil scrub", "position": 0}]',
  35,
  true,
  true
),
(
  'Matcha detox',
  'matcha-detox',
  'Antioxidačný matcha peeling pre hlboké čistenie a detoxikáciu pokožky. Japonský ceremonial grade matcha čaj je bohatý na antioxidanty, ktoré chránia pokožku pred voľnými radikálmi. Zelený čaj stimuluje obnovu buniek a dodáva pokožke zdravý jas.',
  'Antioxidačný matcha peeling',
  24.90,
  29.90,
  'matcha',
  ARRAY['organic', 'vegan'],
  180,
  'Camellia Sinensis (Matcha Green Tea) Leaf Powder, Saccharum Officinarum (Sugar), Cocos Nucifera (Coconut) Oil, Butyrospermum Parkii (Shea Butter), Tocopherol (Vitamin E), Aloe Barbadensis Leaf Juice',
  '[{"url": "", "alt": "Matcha detox", "position": 0}]',
  25,
  true,
  true
),
(
  'Himalayan salt scrub',
  'himalayan-salt-scrub',
  'Minerálny soľný peeling z ružovej himalájskej soli. Obsahuje 84 minerálov a stopových prvkov, ktoré vyživujú pokožku do hĺbky. Soľ jemne exfoliuje a zároveň dezinfikuje — ideálny pre problematickú pokožku alebo po športe.',
  'Minerálny soľný peeling',
  19.90,
  NULL,
  'salt',
  ARRAY['vegan', 'organic'],
  220,
  'Himalayan Pink Salt, Cocos Nucifera (Coconut) Oil, Rosa Canina (Rosehip) Seed Oil, Citrus Sinensis (Sweet Orange) Peel Oil, Tocopherol (Vitamin E)',
  '[{"url": "", "alt": "Himalayan salt scrub", "position": 0}]',
  40,
  true,
  false
),
(
  'Coconut & vanilla',
  'coconut-vanilla',
  'Hydratačný kokosový peeling s vanilkou pre maximálnu jemnosť. Kokosový olej hlboko hydratuje a vanilka dodáva pokožke nezameniteľnú sladkú vôňu. Po použití je pokožka hodvábne hladká a intenzívne vyživená.',
  'Hydratačný kokosový peeling',
  21.90,
  NULL,
  'oil',
  ARRAY['handmade', 'vegan'],
  200,
  'Saccharum Officinarum (Sugar), Cocos Nucifera (Coconut) Oil, Butyrospermum Parkii (Shea Butter), Vanilla Planifolia Fruit Extract, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Tocopherol (Vitamin E)',
  '[{"url": "", "alt": "Coconut & vanilla", "position": 0}]',
  30,
  true,
  false
),
(
  'Charcoal deep clean',
  'charcoal-deep-clean',
  'Detoxikačný peeling s aktívnym uhlím pre hĺbkové čistenie pórov. Aktívne uhlie z bambusu adsorbuje nečistoty a toxíny z pokožky. V kombinácii s tea tree olejom pomáha predchádzať vyrážkam a zanecháva pokožku matne čistú.',
  'Detoxikačný aktívne uhlie',
  23.90,
  NULL,
  'charcoal',
  ARRAY['novinka', 'vegan', 'handmade'],
  180,
  'Activated Charcoal (Bamboo), Saccharum Officinarum (Sugar), Cocos Nucifera (Coconut) Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Kaolin Clay, Tocopherol (Vitamin E)',
  '[{"url": "", "alt": "Charcoal deep clean", "position": 0}]',
  20,
  true,
  true
);

-- Seed sample reviews
INSERT INTO reviews (product_id, name, rating, text, is_approved) VALUES
(
  (SELECT id FROM products WHERE slug = 'coffee-scrub'),
  'Katarína M.',
  5,
  'Kávový scrub je úžasný! Pleť je hladká a vonia ako čerstvé espresso.',
  true
),
(
  (SELECT id FROM products WHERE slug = 'matcha-detox'),
  'Tomáš R.',
  5,
  'Konečne niečo prírodné čo naozaj funguje. Matcha detox je môj favorit.',
  true
),
(
  (SELECT id FROM products WHERE slug = 'lavender-oil-scrub'),
  'Zuzana K.',
  5,
  'Levanduľový scrub pred spaním = najlepší večerný rituál.',
  true
),
(
  (SELECT id FROM products WHERE slug = 'coffee-scrub'),
  'Martin B.',
  4,
  'Výborná textúra a vôňa. Pokožka je po ňom naozaj hladká.',
  true
),
(
  (SELECT id FROM products WHERE slug = 'himalayan-salt-scrub'),
  'Jana P.',
  5,
  'Soľný scrub je perfektný po cvičení. Pokožka je čistá a svieža.',
  true
);

-- Seed a sample coupon
INSERT INTO coupons (code, type, value, min_order, max_uses, valid_from, valid_until, is_active) VALUES
('WELCOME10', 'percentage', 10, 20, 100, NOW(), NOW() + INTERVAL '1 year', true);

-- Seed a sample blog post
INSERT INTO blog_posts (title, slug, content, excerpt, author, is_published, published_at) VALUES
(
  '5 dôvodov prečo používať prírodné peelingy',
  '5-dovodov-preco-pouzivat-prirodne-peelingy',
  '## Prečo prírodné peelingy?

Prírodné peelingy sú viac než len kozmetický produkt — sú to rituály starostlivosti o seba, ktoré robia dobre telu aj mysli.

### 1. Šetrné k pokožke

Na rozdiel od syntetických mikroplastov, prírodné exfolianty ako kávové zrnká, soľ či cukor sa biologicky rozkladajú a sú šetrné k tvojej pokožke.

### 2. Bohaté na živiny

Prírodné ingrediencie ako kokosový olej, bambucké maslo či jojobový olej dodávajú pokožke vitamíny a minerály priamo počas peelingového procesu.

### 3. Aromaterapeutické účinky

Esenciálne oleje v prírodných scruboch — levanduľa na upokojenie, mäta na osvieženie, káva na nabudenie — pôsobia aj na tvoju náladu.

### 4. Ekologické

Žiadne mikroplasty, žiadne syntetické chemikálie. Prírodné peelingy sú šetrné k životnému prostrediu a často prichádzajú v recyklovateľnom balení.

### 5. Podporujú lokálnu výrobu

Keď si kúpiš slovenský prírodný scrub, podporuješ malých výrobcov a lokálnu ekonomiku.',
  'Prírodné peelingy sú viac než len kozmetický produkt. Tu je 5 dôvodov, prečo by si mal/a prejsť na prírodné.',
  'bodyscrub.sk',
  true,
  NOW()
);
