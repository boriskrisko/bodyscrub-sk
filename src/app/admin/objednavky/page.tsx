import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types';
import AdminOrderList from '@/components/admin/AdminOrderList';

export default async function AdminObjednavkyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Objednávky</h1>
      <AdminOrderList orders={(data || []) as Order[]} />
    </div>
  );
}
