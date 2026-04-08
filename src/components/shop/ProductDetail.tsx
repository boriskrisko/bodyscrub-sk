'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Review } from '@/types';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import ReviewForm from './ReviewForm';

const categoryColors: Record<string, string> = {
  coffee: '#8B7355',
  oil: '#6B4D7A',
  matcha: '#4A6741',
  salt: '#C4A97D',
  charcoal: '#1C1C1C',
  lavender: '#6B4D7A',
};

export default function ProductDetail({
  product,
  reviews,
  avgRating,
}: {
  product: Product;
  reviews: Review[];
  avgRating: number;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const color = categoryColors[product.category] || '#4A6741';

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[1100px] mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-sand-600 mb-8">
        <Link href="/" className="hover:text-moss-600 transition-colors">Domov</Link>
        <span className="mx-2">/</span>
        <Link href="/produkty" className="hover:text-moss-600 transition-colors">Produkty</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div
            className="rounded-xl overflow-hidden mb-4 aspect-square flex items-center justify-center relative"
            style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}
          >
            {product.images?.[selectedImage]?.url ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full opacity-20"
                style={{ background: color }}
              />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-moss-600' : 'border-sand-200'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex gap-2 mb-3">
            {product.tags?.map((tag) => (
              <span key={tag} className="tag bg-sand-100 text-sand-600">
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-medium mb-3">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-sand-600">
                {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'recenzia' : 'recenzií'})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-medium text-moss-600">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-lg text-sand-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          <p className="text-sand-800 leading-relaxed mb-6">{product.description || product.short_description}</p>

          {product.weight_grams && (
            <p className="text-sm text-sand-600 mb-2">
              <span className="font-medium">Hmotnosť:</span> {product.weight_grams}g
            </p>
          )}

          {product.stock > 0 ? (
            <p className="text-sm text-moss-600 mb-6">✓ Skladom</p>
          ) : (
            <p className="text-sm text-red-500 mb-6">Vypredané</p>
          )}

          <button
            className="btn-primary w-full md:w-auto mb-4"
            disabled={product.stock <= 0}
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || '',
                quantity: 1,
                slug: product.slug,
              })
            }
          >
            {product.stock > 0 ? 'Pridať do košíka' : 'Vypredané'}
          </button>

          <div className="flex gap-6 text-xs text-sand-600 tracking-wide mt-4">
            <span>🌿 100% prírodné</span>
            <span>📦 Doprava od 40€ zadarmo</span>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      {product.ingredients && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-medium mb-4">Zloženie</h2>
          <div className="bg-white rounded-xl p-6 border border-sand-200">
            <p className="text-sm text-sand-800 leading-relaxed whitespace-pre-line">{product.ingredients}</p>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-medium mb-6">
          Recenzie {reviews.length > 0 && <span className="text-sand-400">({reviews.length})</span>}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sand-600 text-sm mb-6">Zatiaľ žiadne recenzie. Buďte prvý!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 border border-sand-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{review.name}</span>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                  <span className="text-xs text-sand-400">
                    {new Date(review.created_at).toLocaleDateString('sk-SK')}
                  </span>
                </div>
                {review.text && (
                  <p className="text-sm text-sand-800 leading-relaxed">{review.text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}
