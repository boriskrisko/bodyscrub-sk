'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { CATEGORIES } from '@/lib/constants';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export default function ProductListing({ initialProducts }: { initialProducts: Product[] }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<SortOption>('newest');

  const products = useMemo(() => {
    const filtered = filter === 'all'
      ? initialProducts
      : initialProducts.filter((p) => p.category === filter);

    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  }, [initialProducts, filter, sort]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-4 py-1.5 rounded-full border text-[13px] transition-all duration-300 ${
                filter === c.key
                  ? 'bg-moss-600 text-sand-100 border-moss-600'
                  : 'bg-transparent text-sand-600 border-sand-200 hover:border-moss-600 hover:text-moss-600'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-white border border-sand-200 rounded-lg px-3 py-1.5 text-sm text-sand-800 outline-none"
        >
          <option value="newest">Najnovšie</option>
          <option value="price-asc">Cena ↑</option>
          <option value="price-desc">Cena ↓</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-sand-600 py-20">Žiadne produkty v tejto kategórii.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
