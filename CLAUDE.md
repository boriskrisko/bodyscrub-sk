# bodyscrub.sk — E-shop

Prírodné body scrubs e-shop. Stack: Next.js 14 (App Router, TypeScript, src dir) + Supabase + Stripe + Tailwind CSS + Zustand + Resend.

## Referenčné súbory

- `SPEC.md` — kompletný tech spec (DB schéma, architektúra, features, design tokens)
- `REFERENCE-HOMEPAGE.jsx` — React reference pre dizajn, farby, komponenty, layout

Prečítaj oba pred akoukoľvek prácou.

## Brand

- Farby: machová zelená (#4A6741), fialová (#6B4D7A), čierna (#1C1C1C), zemité tóny (sand #C4A97D, orech #8B7355, krém #F5F0E8)
- Fonty: Outfit (display/headings) + DM Sans (body)
- Vibe: prírodný, zemitý, minimálny, unisex wellness
- Tailwind tokeny: viď SPEC.md sekcia 6

## Fázy

### Fáza 1 — Scaffold + základ
- Scaffoldni Next.js 14 (App Router, TS, Tailwind, src dir)
- Nainštaluj: @supabase/supabase-js, @supabase/ssr, stripe, zustand, resend
- Inicializuj Supabase (`npx supabase init`, `npx supabase start`)
- Nastav tailwind.config s brand tokenmi (SPEC.md sekcia 6)
- Supabase migrácia — všetky tabuľky + RLS (SPEC.md sekcia 2)
- lib/supabase/ client.ts, server.ts, admin.ts
- Layout (navbar + footer) + homepage podľa REFERENCE-HOMEPAGE.jsx

### Fáza 2 — Produkty
- /produkty — listing s filtrami (kategória, tagy), sort (cena, najnovšie)
- /produkty/[slug] — detail s galériou, popisom, zložením, recenziami
- SSR/SSG, generateStaticParams
- Structured data (Product schema)

### Fáza 3 — Cart + Checkout
- Zustand cart store (persist localStorage)
- CartDrawer komponent (slide-out, qty +/-, remove, free shipping progress od 40€)
- /pokladna — shipping address form
- /api/stripe/checkout — Stripe Checkout Session, EUR, line items
- /api/stripe/webhook — checkout.session.completed → vytvor order, zníž stock
- /dakujeme — order confirmation

### Fáza 4 — Auth + User účet
- Supabase Auth (email + password, magic link)
- /prihlasenie, /registracia
- /ucet — dashboard, /ucet/objednavky (história + detail), /ucet/nastavenia (profil, adresa, heslo)
- Middleware ochrana /ucet/* routes

### Fáza 5 — Admin panel
- /admin — chránený admin role check
- Produkty CRUD + image upload (Supabase Storage)
- Order management (status, poznámky, filter)
- Coupon CRUD (percentage/fixed, min order, platnosť, max uses)
- Blog CMS (markdown editor, cover image, publish/draft)
- Review moderation (approve/reject)
- Dashboard: počet objednávok, revenue

### Fáza 6 — Blog + Newsletter + SEO
- /blog listing + /blog/[slug] detail (markdown, cover, author, dátum)
- Newsletter signup + /api/newsletter route → Supabase newsletter_subscribers
- Dynamic OG images (opengraph-image.tsx) pre produkty + blog
- sitemap.xml, robots.txt, BreadcrumbList structured data
- GA + Meta Pixel ready (script v layout)

### Fáza 7 — Coupon + Reviews
- Coupon input v checkout — server action validácia (aktívny, platnosť, max_uses, min_order), aplikuj zľavu
- Review formulár na product detail (rating 1-5 + text), is_approved=false
- Priemer ratingu na product card aj detail

### Fáza 8 — Polish + Deploy
- Responsive pass — mobile layout všetky stránky
- Loading states + error handling
- 404 stránka v brand dizajne
- Cookie consent banner
- Favicon + webmanifest
- Deploy Vercel — env: SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- Doména bodyscrub.sk

## Pravidlá

- Vždy čítaj SPEC.md a REFERENCE-HOMEPAGE.jsx pred prácou
- Drž sa brand farieb a fontov všade
- Slovenčina v UI (URL slugy, labels, texty), kód v angličtine
- Mobile-first responsive
- Všetky DB operácie cez Supabase server client (nie anon z frontendu pre writes)
- RLS na všetkých tabuľkách
- Stripe webhook signature verification vždy
- Image upload do Supabase Storage, public bucket pre product images
- Commituj po každej dokončenej fáze
