import { createClient } from '@/lib/supabase/server';
import { Review } from '@/types';
import AdminReviews from '@/components/admin/AdminReviews';

export default async function AdminRecenziePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return <AdminReviews reviews={(data || []) as (Review & { products: { name: string } | null })[]} />;
}
