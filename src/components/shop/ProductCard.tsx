'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';

const categoryColors: Record<string, string> = {
  coffee: '#8B7355',
  oil: '#6B4D7A',
  matcha: '#4A6741',
  salt: '#C4A97D',
  charcoal: '#1C1C1C',
  lavender: '#6B4D7A',
};

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const color = categoryColors[product.category] || '#4A6741';
  const firstImage = product.images?.[0]?.url;

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-sand-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] group">
      <Link href={`/produkty/${product.slug}`}>
        <div
          className="h-[220px] flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}
        >
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full opacity-20"
              style={{ background: color }}
            />
          )}
          {product.tags?.[0] && (
            <span
              className="tag absolute top-3 left-3 text-sand-100"
              style={{ background: color }}
            >
              {product.tags[0].toUpperCase()}
            </span>
          )}
          {product.compare_price && (
            <span className="tag absolute top-3 right-3 bg-red-500 text-white">
              ZĽAVA
            </span>
          )}
        </div>
      </Link>
      <div className="p-5 pb-6">
        <Link href={`/produkty/${product.slug}`}>
          <h3 className="font-display text-lg font-medium mb-1 hover:text-moss-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] text-sand-600 mb-1">{product.short_description}</p>
        {product.weight_grams && (
          <p className="text-[11px] text-sand-400 mb-2">{product.weight_grams}g</p>
        )}
        {product.avg_rating !== undefined && product.review_count !== undefined && product.review_count > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={Math.round(product.avg_rating)} size={12} />
            <span className="text-[11px] text-sand-400">({product.review_count})</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-medium text-moss-600">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-sand-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          <button
            className="btn-primary !py-2.5 !px-5 !text-xs"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: firstImage || '',
                quantity: 1,
                slug: product.slug,
              })
            }
          >
            Do košíka
          </button>
        </div>
      </div>
    </div>
  );
}
