import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminCustomers from '@/components/admin/AdminCustomers';

interface CustomerData {
  id: string;
  email: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export default async function AdminZakazniciPage() {
  const adminSupabase = createAdminClient();
  const supabase = createClient();

  // Get all users
  const { data: usersData } = await adminSupabase.auth.admin.listUsers({ perPage: 500 });
  const users = usersData?.users || [];

  // Get order stats per user
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total, status')
    .not('user_id', 'is', null);

  const orderStats = new Map<string, { count: number; spent: number }>();
  (orders || []).forEach((o) => {
    if (!o.user_id) return;
    const existing = orderStats.get(o.user_id) || { count: 0, spent: 0 };
    existing.count += 1;
    if (['paid', 'shipped', 'delivered'].includes(o.status)) {
      existing.spent += Number(o.total);
    }
    orderStats.set(o.user_id, existing);
  });

  const customers: CustomerData[] = users
    .filter((u) => u.app_metadata?.role !== 'admin')
    .map((u) => ({
      id: u.id,
      email: u.email || '',
      created_at: u.created_at,
      order_count: orderStats.get(u.id)?.count || 0,
      total_spent: orderStats.get(u.id)?.spent || 0,
    }))
    .sort((a, b) => b.total_spent - a.total_spent);

  return <AdminCustomers customers={customers} />;
}
