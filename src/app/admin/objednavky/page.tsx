import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types';
import AdminOrders from '@/components/admin/AdminOrders';

export default async function AdminObjednavkyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminOrders initialOrders={(data || []) as Order[]} />;
}
