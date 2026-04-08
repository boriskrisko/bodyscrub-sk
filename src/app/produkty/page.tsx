import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import ProductListing from '@/components/shop/ProductListing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produkty',
  description: 'Prírodné body scrubs — olejové, kávové, matcha, levanduľové a soľné peelingy vyrobené na Slovensku.',
};

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export default async function ProduktyPage() {
  const products = await getProducts();

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[1100px] mx-auto min-h-screen">
      <div className="text-center mb-12">
        <span className="tag bg-sand-100 text-sand-600 mb-3 inline-block">NAŠE PRODUKTY</span>
        <h1 className="font-display text-3xl md:text-4xl font-light mt-2">
          Prírodné <span className="font-semibold text-moss-600">body scrubs</span>
        </h1>
        <p className="text-sm text-sand-600 mt-3 max-w-md mx-auto">
          Vyrobené s láskou na Slovensku z prírodných ingrediencií
        </p>
      </div>
      <ProductListing initialProducts={products} />
    </div>
  );
}
