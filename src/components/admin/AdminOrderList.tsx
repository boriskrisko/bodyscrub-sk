'use client';

import { useState } from 'react';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminOrderList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClient();
  const router = useRouter();

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    router.refresh();
  };

  return (
    <>
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...Object.keys(ORDER_STATUSES)].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
              filter === s
                ? 'bg-moss-600 text-sand-100 border-moss-600'
                : 'border-sand-200 text-sand-600 hover:border-moss-600'
            }`}
          >
            {s === 'all' ? 'Všetky' : ORDER_STATUSES[s as keyof typeof ORDER_STATUSES]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-sand-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
              <div>
                <span className="font-medium">{order.order_number}</span>
                <span className="text-sm text-sand-400 ml-2">{order.email}</span>
                <span className="text-xs text-sand-400 ml-2">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="text-xs border border-sand-200 rounded-lg px-2 py-1 outline-none"
                >
                  {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <span className="font-medium text-moss-600">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="text-xs text-sand-600 space-y-0.5">
              {order.items.map((item, i) => (
                <div key={i}>{item.name} × {item.quantity}</div>
              ))}
            </div>
            {order.shipping_address && (
              <div className="text-xs text-sand-400 mt-2">
                {order.shipping_address.name}, {order.shipping_address.street}, {order.shipping_address.city} {order.shipping_address.zip}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sand-600 text-center py-8">Žiadne objednávky</p>
        )}
      </div>
    </>
  );
}
