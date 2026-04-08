import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import AdminProducts from '@/components/admin/AdminProducts';

export default async function AdminProduktyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminProducts initialProducts={(data || []) as Product[]} />;
}
