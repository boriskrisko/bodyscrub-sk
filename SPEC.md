# bodyscrub.sk — Tech Spec

**Typ:** E-shop — prírodné body scrubs (olejové, kávové, matcha, levanduľové...)
**Stack:** Next.js 14 (App Router) + Supabase + Stripe + Tailwind CSS
**Cieľovka:** Unisex, wellness-oriented, SK/CZ trh
**Brand vibe:** Machová zelená + fialová + zemité tóny + čierna

---

## 1. Architektúra

```
bodyscrub.sk/
├── app/
│   ├── (shop)/
│   │   ├── page.tsx              # Homepage / landing
│   │   ├── produkty/
│   │   │   ├── page.tsx          # Product listing (filtrovanie, sort)
│   │   │   └── [slug]/page.tsx   # Product detail
│   │   ├── kosik/page.tsx        # Cart
│   │   ├── pokladna/page.tsx     # Checkout (Stripe)
│   │   └── dakujeme/page.tsx     # Order confirmation
│   ├── (info)/
│   │   ├── o-nas/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── obchodne-podmienky/page.tsx
│   │   ├── ochrana-udajov/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── (auth)/
│   │   ├── prihlasenie/page.tsx
│   │   └── registracia/page.tsx
│   ├── ucet/
│   │   ├── page.tsx              # Dashboard
│   │   ├── objednavky/page.tsx
│   │   └── nastavenia/page.tsx
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── produkty/page.tsx     # CRUD products
│   │   ├── objednavky/page.tsx   # Order management
│   │   ├── kupony/page.tsx       # Discount codes
│   │   └── blog/page.tsx         # Blog CMS
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── newsletter/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Reusable (Button, Input, Badge...)
│   ├── shop/                     # ProductCard, CartDrawer, FilterBar...
│   ├── layout/                   # Navbar, Footer, MobileMenu
│   └── marketing/                # Hero, Testimonials, Newsletter
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── useCart.ts                # Zustand cart store
│   └── useAuth.ts
├── types/
│   └── index.ts
└── public/
    ├── images/
    └── fonts/
```

---

## 2. Supabase — Databázová schéma

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | Názov produktu |
| slug | text UNIQUE | URL slug |
| description | text | Popis (rich text / markdown) |
| short_description | text | Krátky popis pre karty |
| price | numeric(10,2) | Cena v EUR |
| compare_price | numeric(10,2) | Pôvodná cena (optional, pre zľavy) |
| category | text | oil, coffee, matcha, lavender, salt... |
| tags | text[] | vegan, organic, handmade... |
| weight_grams | int | Hmotnosť |
| ingredients | text | Zloženie |
| images | jsonb | [{url, alt, position}] |
| stock | int | default 0 |
| is_active | bool | default true |
| is_featured | bool | default false |
| seo_title | text | |
| seo_description | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| order_number | text UNIQUE | BS-YYYYMMDD-XXXX |
| user_id | uuid FK → auth.users | nullable (guest checkout) |
| email | text | |
| status | text | pending, paid, shipped, delivered, cancelled |
| items | jsonb | [{product_id, name, price, quantity, image}] |
| subtotal | numeric(10,2) | |
| shipping_cost | numeric(10,2) | |
| discount_amount | numeric(10,2) | |
| total | numeric(10,2) | |
| shipping_address | jsonb | {name, street, city, zip, country} |
| billing_address | jsonb | |
| stripe_session_id | text | |
| stripe_payment_intent | text | |
| coupon_code | text | |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `coupons`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| code | text UNIQUE | LETO2026 |
| type | text | percentage, fixed |
| value | numeric(10,2) | |
| min_order | numeric(10,2) | Min. suma objednávky |
| max_uses | int | |
| used_count | int | default 0 |
| valid_from | timestamptz | |
| valid_until | timestamptz | |
| is_active | bool | |

### `blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| title | text | |
| slug | text UNIQUE | |
| content | text | Markdown |
| excerpt | text | |
| cover_image | text | URL |
| author | text | |
| is_published | bool | |
| published_at | timestamptz | |
| created_at | timestamptz | |

### `newsletter_subscribers`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| email | text UNIQUE | |
| is_active | bool | default true |
| subscribed_at | timestamptz | |

### `reviews`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| product_id | uuid FK | |
| user_id | uuid FK | nullable |
| name | text | |
| rating | int | 1-5 |
| text | text | |
| is_approved | bool | default false |
| created_at | timestamptz | |

### RLS Policies
- `products`: SELECT public, INSERT/UPDATE/DELETE admin only
- `orders`: SELECT own orders or admin, INSERT authenticated + anon
- `reviews`: SELECT approved or admin, INSERT authenticated
- `coupons`: SELECT public (active only), INSERT/UPDATE/DELETE admin
- `blog_posts`: SELECT published or admin, INSERT/UPDATE/DELETE admin
- Admin check: `auth.jwt() ->> 'role' = 'admin'` via custom claim

---

## 3. Stripe integrácia

### Checkout flow
1. User builds cart (Zustand, persisted to localStorage)
2. Click "Objednať" → POST `/api/stripe/checkout`
3. Server creates Stripe Checkout Session s line items
4. Redirect to Stripe hosted checkout
5. Stripe webhook (`checkout.session.completed`) → vytvor order v Supabase, zníž stock
6. Redirect na `/dakujeme?session_id=...`

### Stripe config
- Currency: EUR
- Shipping: Slovenský Balíkovo / Packeta / Zásielkovňa
- Free shipping nad 40€
- Coupons: Stripe Promotion Codes synced s DB

---

## 4. Key Features — MVP

### Zákazník
- [x] Product listing s filtrami (kategória, tagy, cena)
- [x] Product detail s galériou, popisom, zložením
- [x] Cart (slide-out drawer)
- [x] Stripe checkout (guest + registered)
- [x] User account — história objednávok
- [x] Newsletter signup
- [x] Blog (SEO content marketing)
- [x] Reviews na produktoch
- [x] Coupon codes
- [x] Responsive (mobile-first)

### Admin
- [x] Product CRUD s image upload (Supabase Storage)
- [x] Order management (status updates, notes)
- [x] Coupon management
- [x] Blog CMS
- [x] Review moderation
- [x] Basic analytics (orders/revenue dashboard)

### SEO & Marketing
- [x] SSR/SSG pre všetky product + blog pages
- [x] Structured data (Product, BreadcrumbList, Article)
- [x] Sitemap + robots.txt
- [x] OG images (dynamic via `opengraph-image.tsx`)
- [x] Google Analytics / Meta Pixel ready

---

## 5. Shipping & Legal (SK)

### Doručenie
- Packeta/Zásielkovňa widget integrácia (pickup points)
- Slovenská pošta (home delivery)
- Free shipping od 40€
- Tracking number v order status emails

### Legal requirements
- Obchodné podmienky
- Ochrana osobných údajov (GDPR)
- Reklamačný poriadok
- Cookie consent banner
- Fakturácia: SuperFaktúra API integrácia (auto-generate faktúry)

---

## 6. Brand Design Tokens (Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#F0F5EE',
          100: '#D9E8D4',
          200: '#B5D1A8',
          400: '#6D9B5E',
          600: '#4A6741',
          800: '#2E4229',
          900: '#1A2B17',
        },
        plum: {
          50: '#F3EEF5',
          100: '#E0D4E6',
          200: '#C4A9CC',
          400: '#8E6A9E',
          600: '#6B4D7A',
          800: '#45304F',
          900: '#2A1D30',
        },
        sand: {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#E8DCC8',
          400: '#C4A97D',
          600: '#8B7355',
          800: '#5C4A30',
        },
        ink: '#1C1C1C',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
}
```

---

## 7. Fázy nasadenia

### Fáza 1 — MVP (2-3 týždne)
- Homepage + product listing + detail
- Cart + Stripe checkout
- Admin: product CRUD
- Deploy na Vercel, doména bodyscrub.sk

### Fáza 2 — Polish (1-2 týždne)
- User accounts + order history
- Reviews
- Blog
- Newsletter
- Coupon system
- SuperFaktúra integrácia

### Fáza 3 — Scale
- Packeta widget
- Abandoned cart emails (Resend)
- Upsell / cross-sell logic
- A/B testing na homepage
- Affiliate / referral system

---

## 8. Hosting & Infra

| Služba | Provider | Cena |
|--------|----------|------|
| Frontend + API | Vercel (Pro) | ~20€/m |
| Database + Auth + Storage | Supabase (Pro) | ~25€/m |
| Payments | Stripe | 1.4% + 0.25€ / tx |
| Email (transactional) | Resend | free tier → ~20€/m |
| Doména | bodyscrub.sk | ~12€/rok |
| Fakturácia | SuperFaktúra | ~10€/m |
| **Total fixed** | | **~75-87€/m** |
