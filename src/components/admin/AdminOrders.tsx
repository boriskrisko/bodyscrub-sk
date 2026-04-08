'use client';

import { useState, useMemo } from 'react';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SearchInput, Pagination, StatusBadge, EmptyState, useToast, useDebounce } from './AdminUI';

const PER_PAGE = 20;

export default function AdminOrders({ initialOrders }: { initialOrders: Order[] }) {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Order | null>(null);
  const [note, setNote] = useState('');

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!o.order_number.toLowerCase().includes(q) && !o.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [orders, statusFilter, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    toast(`Stav objednávky zmenený na "${ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]}"`);
    router.refresh();
  };

  const addNote = async (id: string) => {
    if (!note.trim()) return;
    await supabase.from('orders').update({ notes: note }).eq('id', id);
    toast('Poznámka uložená');
    setNote('');
    router.refresh();
  };

  const exportCSV = () => {
    const headers = ['Objednávka', 'Email', 'Stav', 'Suma', 'Dátum', 'Položky'];
    const rows = filtered.map((o) => [
      o.order_number,
      o.email,
      ORDER_STATUSES[o.status] || o.status,
      o.total,
      new Date(o.created_at).toLocaleDateString('sk-SK'),
      o.items.map((i) => `${i.name} x${i.quantity}`).join('; '),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `objednavky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportované');
  };

  // Order detail view
  if (detail) {
    return (
      <div>
        <button onClick={() => setDetail(null)} className="text-sm text-sand-500 hover:text-moss-600 mb-4 transition-colors">
          ← Späť na objednávky
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-display text-xl font-semibold">{detail.order_number}</h2>
                  <p className="text-sm text-sand-400">{formatDate(detail.created_at)}</p>
                </div>
                <StatusBadge status={detail.status} />
              </div>

              <h3 className="font-medium text-sm mb-3">Položky</h3>
              <div className="space-y-2 mb-4">
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-sand-100 last:border-0">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sand-400 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm border-t border-sand-200 pt-3">
                <div className="flex justify-between"><span className="text-sand-600">Medzisúčet</span><span>{formatPrice(detail.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-sand-600">Doprava</span><span>{detail.shipping_cost === 0 ? 'Zadarmo' : formatPrice(detail.shipping_cost)}</span></div>
                {detail.discount_amount > 0 && (
                  <div className="flex justify-between text-moss-600"><span>Zľava{detail.coupon_code && ` (${detail.coupon_code})`}</span><span>-{formatPrice(detail.discount_amount)}</span></div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-sand-100">
                  <span>Celkom</span><span className="text-moss-600">{formatPrice(detail.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <h3 className="font-medium text-sm mb-3">Poznámky</h3>
              {detail.notes && <p className="text-sm text-sand-600 mb-3 bg-sand-50 p-3 rounded-lg">{detail.notes}</p>}
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Pridať poznámku..."
                  className="flex-1 px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none focus:border-moss-600 transition-colors"
                />
                <button onClick={() => addNote(detail.id)} className="btn-primary !py-2 !px-4 !text-xs">Uložiť</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <h3 className="font-medium text-sm mb-3">Zákazník</h3>
              <p className="text-sm">{detail.email}</p>
              {detail.stripe_payment_intent && (
                <p className="text-xs text-sand-400 mt-1 break-all">Stripe: {detail.stripe_payment_intent}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-sand-200 p-6">
              <h3 className="font-medium text-sm mb-3">Zmeniť stav</h3>
              <select
                value={detail.status}
                onChange={(e) => { updateStatus(detail.id, e.target.value); setDetail({ ...detail, status: e.target.value as Order['status'] }); }}
                className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none focus:border-moss-600 transition-colors"
              >
                {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {detail.shipping_address && (
              <div className="bg-white rounded-xl border border-sand-200 p-6">
                <h3 className="font-medium text-sm mb-3">Dodacia adresa</h3>
                <div className="text-sm text-sand-600 space-y-0.5">
                  <p>{detail.shipping_address.name}</p>
                  <p>{detail.shipping_address.street}</p>
                  <p>{detail.shipping_address.zip} {detail.shipping_address.city}</p>
                  <p>{detail.shipping_address.country}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="btn-outline w-full !text-xs"
            >
              Tlačiť objednávku
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="font-display text-2xl font-semibold">Objednávky</h1>
        <button onClick={exportCSV} className="btn-outline !text-xs">
          Exportovať CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-sand-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Hľadať objednávku alebo email..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...Object.keys(ORDER_STATUSES)].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                  statusFilter === s
                    ? 'bg-moss-600 text-white border-moss-600'
                    : 'border-sand-200 text-sand-600 hover:border-moss-600'
                }`}
              >
                {s === 'all' ? `Všetky (${orders.length})` : `${ORDER_STATUSES[s as keyof typeof ORDER_STATUSES]} (${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState message="Žiadne objednávky" />
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400 bg-sand-50">
                  <th className="p-3 font-medium">Objednávka</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Stav</th>
                  <th className="p-3 font-medium">Položky</th>
                  <th className="p-3 font-medium text-right">Suma</th>
                  <th className="p-3 font-medium text-right">Dátum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {paged.map((o) => (
                  <tr key={o.id} className="hover:bg-sand-50/50 transition-colors cursor-pointer" onClick={() => setDetail(o)}>
                    <td className="p-3 font-medium">{o.order_number}</td>
                    <td className="p-3 text-sand-600 truncate max-w-[180px]">{o.email}</td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                    <td className="p-3 text-sand-400 text-xs">{o.items.length} položiek</td>
                    <td className="p-3 text-right font-medium">{formatPrice(o.total)}</td>
                    <td className="p-3 text-right text-sand-400 text-xs">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-sand-100 text-xs text-sand-400 flex justify-between items-center">
            <span>{filtered.length} objednávok</span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
