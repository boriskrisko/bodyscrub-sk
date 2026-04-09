import { createClient } from '@/lib/supabase/server';
import { Product, Review } from '@/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import ProductDetail from '@/components/shop/ProductDetail';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

async function getReviews(productId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Produkt nenájdený' };

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.short_description || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description || '',
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
      url: `${SITE_URL}/produkty/${product.slug}`,
      type: 'website',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: Product | null = null;
  let reviews: Review[] = [];

  try {
    product = await getProduct(params.slug);
  } catch (e) {
    console.error('getProduct error:', e);
  }
  if (!product) notFound();

  try {
    reviews = await getReviews(product.id);
  } catch (e) {
    console.error('getReviews error:', e);
  }
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Product structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description,
    image: product.images?.map((i) => i.url),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/produkty/${product.slug}`,
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} reviews={reviews} avgRating={avgRating} />
    </>
  );
}
