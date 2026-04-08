import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Moje objednávky',
};

export default async function ObjednavkyPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/prihlasenie');

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const typedOrders = (orders || []) as Order[];

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[800px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/ucet" className="text-sand-400 hover:text-moss-600 transition-colors">
          ← Účet
        </Link>
        <h1 className="font-display text-3xl font-medium">Moje objednávky</h1>
      </div>

      {typedOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sand-600 mb-4">Zatiaľ žiadne objednávky</p>
          <Link href="/produkty" className="btn-primary inline-block">
            Nakupovať
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {typedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-sand-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                <div>
                  <span className="font-display font-medium">{order.order_number}</span>
                  <span className="text-sm text-sand-400 ml-3">{formatDate(order.created_at)}</span>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full inline-block w-fit ${
                    order.status === 'paid'
                      ? 'bg-moss-100 text-moss-600'
                      : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-600'
                        : order.status === 'delivered'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-sand-100 text-sand-600'
                  }`}
                >
                  {ORDER_STATUSES[order.status]}
                </span>
              </div>
              <div className="space-y-1 text-sm text-sand-800 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-sand-200 pt-3 font-medium">
                <span>Celkom</span>
                <span className="text-moss-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
