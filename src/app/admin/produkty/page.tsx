import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import AdminProductList from '@/components/admin/AdminProductList';

export default async function AdminProduktyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Produkty</h1>
      <AdminProductList products={(data || []) as Product[]} />
    </div>
  );
}
