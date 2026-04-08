import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: orderCount },
    { count: productCount },
    { data: revenueData },
    { count: pendingReviews },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'delivered']),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
  ]);

  const revenue = (revenueData || []).reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: 'Objednávky', value: orderCount || 0 },
    { label: 'Produkty', value: productCount || 0 },
    { label: 'Revenue', value: formatPrice(revenue) },
    { label: 'Čakajúce recenzie', value: pendingReviews || 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-sand-200 p-5">
            <div className="text-2xl font-display font-medium text-moss-600">{s.value}</div>
            <div className="text-sm text-sand-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
