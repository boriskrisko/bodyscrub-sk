import { createClient } from '@/lib/supabase/server';
import { Review } from '@/types';
import AdminReviewList from '@/components/admin/AdminReviewList';

export default async function AdminRecenziePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Recenzie</h1>
      <AdminReviewList reviews={(data || []) as (Review & { products: { name: string } | null })[]} />
    </div>
  );
}
