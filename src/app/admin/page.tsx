import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils';
import { StatCard, StatusBadge } from '@/components/admin/AdminUI';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: allOrders },
    { data: todayOrders },
    { data: weekOrders },
    { data: monthOrders },
    { data: products },
    { count: pendingReviewCount },
    { count: subscriberCount },
    { count: recentSubCount },
  ] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at, order_number, email, items').order('created_at', { ascending: false }),
    supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'delivered']).gte('created_at', todayStart),
    supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'delivered']).gte('created_at', weekStart),
    supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'delivered']).gte('created_at', monthStart),
    supabase.from('products').select('id, name, slug, stock, is_active'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('subscribed_at', weekStart),
  ]);

  const orders = allOrders || [];
  const revenueToday = (todayOrders || []).reduce((s, o) => s + Number(o.total), 0);
  const revenueWeek = (weekOrders || []).reduce((s, o) => s + Number(o.total), 0);
  const revenueMonth = (monthOrders || []).reduce((s, o) => s + Number(o.total), 0);
  const revenueTotal = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).reduce((s, o) => s + Number(o.total), 0);

  // Order counts by status
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  // Top selling products (from order items)
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status)).forEach((o) => {
    (o.items as { name: string; quantity: number; price: number }[])?.forEach((item) => {
      const key = item.name;
      if (!productSales[key]) productSales[key] = { name: key, qty: 0, revenue: 0 };
      productSales[key].qty += item.quantity;
      productSales[key].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Low stock
  const lowStock = (products || []).filter((p) => p.is_active && p.stock < 10).sort((a, b) => a.stock - b.stock);

  // Recent orders
  const recentOrders = orders.slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Revenue row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Dnes" value={formatPrice(revenueToday)} accent />
        <StatCard label="Tento týždeň" value={formatPrice(revenueWeek)} />
        <StatCard label="Tento mesiac" value={formatPrice(revenueMonth)} />
        <StatCard label="Celkovo" value={formatPrice(revenueTotal)} accent />
      </div>

      {/* Status + alerts row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {(['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
          <div key={status} className="bg-white rounded-xl border border-sand-200 p-4 text-center">
            <div className="font-display text-xl font-semibold">{statusCounts[status] || 0}</div>
            <StatusBadge status={status} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-sand-200 p-5">
          <h3 className="font-display font-medium mb-4">Prehľad</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-sand-600">Objednávky celkom</span>
              <span className="font-medium">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-600">Aktívne produkty</span>
              <span className="font-medium">{(products || []).filter(p => p.is_active).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-600">Čakajúce recenzie</span>
              <Link href="/admin/recenzie" className="font-medium text-moss-600 hover:underline">
                {pendingReviewCount || 0}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-600">Newsletter odberatelia</span>
              <span className="font-medium">{subscriberCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-600">Noví odberatelia (týždeň)</span>
              <span className="font-medium text-moss-600">+{recentSubCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-sand-200 p-5">
          <h3 className="font-display font-medium mb-4">Top produkty</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-sand-400">Zatiaľ žiadne predaje</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sand-400 text-xs w-4">{i + 1}.</span>
                    <span className="truncate">{p.name}</span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-medium">{formatPrice(p.revenue)}</span>
                    <span className="text-sand-400 text-xs ml-1">({p.qty}×)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-xl border border-sand-200 p-5">
          <h3 className="font-display font-medium mb-4">
            Nízky sklad
            {lowStock.length > 0 && (
              <span className="ml-2 text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">{lowStock.length}</span>
            )}
          </h3>
          {lowStock.length === 0 ? (
            <p className="text-sm text-sand-400">Všetko na sklade</p>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex justify-between items-center text-sm">
                  <Link href="/admin/produkty" className="truncate hover:text-moss-600 transition-colors">
                    {p.name}
                  </Link>
                  <span className={`font-medium shrink-0 ml-2 ${p.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                    {p.stock === 0 ? 'Vypredané' : `${p.stock} ks`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-sand-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-medium">Posledné objednávky</h3>
          <Link href="/admin/objednavky" className="text-xs text-moss-600 hover:underline">
            Zobraziť všetky →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-sand-400">Zatiaľ žiadne objednávky</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400">
                  <th className="pb-2 font-medium">Objednávka</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Stav</th>
                  <th className="pb-2 font-medium text-right">Suma</th>
                  <th className="pb-2 font-medium text-right">Dátum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-sand-50 transition-colors">
                    <td className="py-2.5 font-medium">{o.order_number}</td>
                    <td className="py-2.5 text-sand-600 truncate max-w-[180px]">{o.email}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="py-2.5 text-right font-medium">{formatPrice(o.total)}</td>
                    <td className="py-2.5 text-right text-sand-400 text-xs">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
