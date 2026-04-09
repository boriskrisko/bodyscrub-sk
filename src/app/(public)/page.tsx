import Link from 'next/link';
import ScrubCircle from '@/components/marketing/ScrubCircle';
import StarRating from '@/components/ui/StarRating';
import NewsletterForm from '@/components/marketing/NewsletterForm';
import ProductCard from '@/components/shop/ProductCard';
import { createClient } from '@/lib/supabase/server';
import { Product, Review } from '@/types';

export const revalidate = 60;

const steps = [
  { step: '01', title: 'Navlhči pokožku', desc: 'Teplou vodou priprav pokožku na peeling' },
  { step: '02', title: 'Nanášaj krúživými pohybmi', desc: 'Jemne masíruj scrub 2-3 minúty' },
  { step: '03', title: 'Opláchni a pocíť rozdiel', desc: 'Hladká, hydratovaná a voňavá pokožka' },
];

const fallbackReviews = [
  { name: 'Katarína M.', text: 'Kávový scrub je úžasný! Pleť je hladká a vonia ako čerstvé espresso.', rating: 5 },
  { name: 'Tomáš R.', text: 'Konečne niečo prírodné čo naozaj funguje. Matcha detox je môj favorit.', rating: 5 },
  { name: 'Zuzana K.', text: 'Levanduľový scrub pred spaním = najlepší večerný rituál.', rating: 5 },
];

export default async function HomePage() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // If fewer than 3 featured, get all active
  let displayProducts = (products || []) as Product[];
  if (displayProducts.length < 3) {
    const { data: allProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);
    displayProducts = (allProducts || []) as Product[];
  }

  const { data: dbReviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const reviews = (dbReviews && dbReviews.length > 0)
    ? (dbReviews as Review[]).map((r) => ({ name: r.name, text: r.text || '', rating: r.rating }))
    : fallbackReviews;

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center px-6 md:px-10 pt-[120px] pb-20 relative overflow-hidden">
        <div className="absolute top-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-moss-600 opacity-[0.04]" />
        <div className="absolute bottom-[10%] -left-[8%] w-[300px] h-[300px] rounded-full bg-plum-600 opacity-[0.04]" />

        <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[60px] items-center">
          <div>
            <div className="animate-fade-up inline-block mb-5">
              <span className="tag bg-moss-600 text-moss-100">100% PRÍRODNÉ</span>
            </div>
            <h1 className="animate-fade-up font-display text-4xl md:text-[52px] font-light leading-[1.15] mb-5 tracking-tight">
              Tvoj denný<br />
              <span className="font-semibold text-moss-600">scrub rituál</span>
            </h1>
            <p className="animate-fade-up-delay-1 text-base leading-relaxed text-sand-800 max-w-[420px] mb-8">
              Olejové, kávové a prírodné scrubs vyrobené na Slovensku. Starostlivosť o telo, ktorá voní ako príroda.
            </p>
            <div className="animate-fade-up-delay-2 flex gap-3 items-center flex-wrap">
              <Link href="/produkty" className="btn-primary">Objednať teraz</Link>
              <Link href="#products" className="btn-outline">Zistiť viac</Link>
            </div>
            <div className="animate-fade-up-delay-2 flex gap-6 mt-10 text-xs text-sand-600 tracking-[1px]">
              <span>VEGAN</span>
              <span className="text-sand-200">·</span>
              <span>ORGANIC</span>
              <span className="text-sand-200">·</span>
              <span>HANDMADE</span>
              <span className="text-sand-200">·</span>
              <span>CRUELTY FREE</span>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center relative">
            <div className="animate-float relative">
              <ScrubCircle color="#4A6741" size={220} />
              <div className="absolute -top-[30px] -right-[40px]">
                <ScrubCircle color="#6B4D7A" size={90} label="LAVENDER" />
              </div>
              <div className="absolute -bottom-[20px] -left-[50px]">
                <ScrubCircle color="#8B7355" size={100} label="COFFEE" />
              </div>
              <div className="absolute bottom-[40px] -right-[60px]">
                <ScrubCircle color="#C4A97D" size={70} label="SALT" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP bar */}
      <section className="bg-moss-600 py-7 px-6 md:px-10 flex justify-center gap-8 md:gap-12 flex-wrap">
        {[
          { icon: '🌿', text: '100% prírodné zloženie' },
          { icon: '📦', text: 'Doprava zadarmo od 40€' },
          { icon: '🇸🇰', text: 'Vyrobené na Slovensku' },
          { icon: '♻️', text: 'Ekologické balenie' },
        ].map((u, i) => (
          <div key={i} className="flex items-center gap-2.5 text-moss-100 text-[13px] tracking-wide">
            <span className="text-base">{u.icon}</span>
            <span>{u.text}</span>
          </div>
        ))}
      </section>

      {/* Products — from DB */}
      <section id="products" className="py-20 px-6 md:px-10 max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <span className="tag bg-sand-100 text-sand-600 mb-3 inline-block">PRODUKTY</span>
          <h2 className="font-display text-3xl md:text-4xl font-light mt-2">
            Vyber si svoj <span className="font-semibold text-moss-600">scrub</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/produkty" className="btn-outline">
            Zobraziť všetky produkty →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 md:px-10 bg-ink">
        <div className="max-w-[900px] mx-auto text-center">
          <span className="tag bg-moss-600/20 text-moss-400 mb-3 inline-block">AKO NA TO</span>
          <h2 className="font-display text-3xl md:text-4xl font-light text-sand-100 mt-2 mb-12">
            Jednoduchý <span className="font-semibold text-moss-400">rituál</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={i}>
                <span className="font-display text-[40px] font-extralight text-moss-600">{s.step}</span>
                <h3 className="font-display text-lg font-medium text-sand-100 mt-2 mb-2">{s.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — from DB */}
      <section className="py-20 px-6 md:px-10 max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <span className="tag bg-sand-100 text-sand-600 inline-block">RECENZIE</span>
          <h2 className="font-display text-3xl md:text-4xl font-light mt-3">
            Čo hovoria <span className="font-semibold text-plum-600">zákazníci</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-lg p-7 border border-sand-200">
              <div className="mb-3">
                <StarRating rating={r.rating} />
              </div>
              <p className="text-sm leading-relaxed text-sand-800 mb-4">&ldquo;{r.text}&rdquo;</p>
              <p className="text-xs font-medium text-sand-600">{r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-br from-moss-600 to-moss-800 text-center">
        <div className="max-w-[500px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-light text-sand-100 mb-2">
            Chceš <span className="font-semibold">10% zľavu</span>?
          </h2>
          <p className="text-sm text-moss-200 mb-6">
            Prihlás sa do newslettera a získaj zľavový kód na prvú objednávku.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
