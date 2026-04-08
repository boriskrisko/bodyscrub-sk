'use client';

import { useState } from 'react';
import ScrubCircle from './ScrubCircle';
import { useCartStore } from '@/hooks/useCart';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const products = [
  { id: '1', name: 'Coffee scrub', slug: 'coffee-scrub', desc: 'Energizujúci kávový peeling', price: 18.90, tag: 'BESTSELLER', category: 'coffee', weight: '200g', color: '#8B7355' },
  { id: '2', name: 'Lavender oil scrub', slug: 'lavender-oil-scrub', desc: 'Upokojujúci levanduľový rituál', price: 22.90, tag: 'NOVINKA', category: 'oil', weight: '150g', color: '#6B4D7A' },
  { id: '3', name: 'Matcha detox', slug: 'matcha-detox', desc: 'Antioxidačný matcha peeling', price: 24.90, tag: 'ORGANIC', category: 'matcha', weight: '180g', color: '#4A6741' },
  { id: '4', name: 'Himalayan salt scrub', slug: 'himalayan-salt-scrub', desc: 'Minerálny soľný peeling', price: 19.90, tag: 'VEGAN', category: 'salt', weight: '220g', color: '#C4A97D' },
  { id: '5', name: 'Coconut & vanilla', slug: 'coconut-vanilla', desc: 'Hydratačný kokosový peeling', price: 21.90, tag: 'HANDMADE', category: 'oil', weight: '200g', color: '#8B7355' },
  { id: '6', name: 'Charcoal deep clean', slug: 'charcoal-deep-clean', desc: 'Detoxikačný aktívne uhlie', price: 23.90, tag: 'NOVINKA', category: 'charcoal', weight: '180g', color: '#1C1C1C' },
];

export default function HomeProducts() {
  const [filter, setFilter] = useState('all');
  const addItem = useCartStore((s) => s.addItem);

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <>
      <div className="flex gap-2 justify-center mb-10 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-5 py-2 rounded-full border text-[13px] transition-all duration-300 ${
              filter === c.key
                ? 'bg-moss-600 text-sand-100 border-moss-600'
                : 'bg-transparent text-sand-600 border-sand-200 hover:border-moss-600 hover:text-moss-600'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg overflow-hidden border border-sand-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          >
            <Link href={`/produkty/${p.slug}`}>
              <div
                className="h-[200px] flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${p.color}15, ${p.color}08)` }}
              >
                <ScrubCircle color={p.color} size={100} />
                <span
                  className="tag absolute top-3 left-3 text-sand-100"
                  style={{ background: p.color }}
                >
                  {p.tag}
                </span>
              </div>
            </Link>
            <div className="p-5 pb-6">
              <Link href={`/produkty/${p.slug}`}>
                <h3 className="font-display text-lg font-medium mb-1 hover:text-moss-600 transition-colors">{p.name}</h3>
              </Link>
              <p className="text-[13px] text-sand-600 mb-1">{p.desc}</p>
              <p className="text-[11px] text-sand-400 mb-4">{p.weight}</p>
              <div className="flex justify-between items-center">
                <span className="font-display text-[22px] font-medium text-moss-600">
                  {formatPrice(p.price)}
                </span>
                <button
                  className="btn-primary !py-2.5 !px-5 !text-xs"
                  onClick={() =>
                    addItem({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: '',
                      quantity: 1,
                      slug: p.slug,
                    })
                  }
                >
                  Do košíka
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
