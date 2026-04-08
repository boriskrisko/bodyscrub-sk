'use client';

import { useState } from 'react';
import { Coupon } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, EmptyState, useToast } from './AdminUI';

export default function AdminCoupons({ coupons }: { coupons: Coupon[] }) {
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', type: 'percentage' as 'percentage' | 'fixed', value: '',
    min_order: '', max_uses: '', valid_from: '', valid_until: '',
  });
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      min_order: form.min_order ? parseFloat(form.min_order) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
      is_active: true,
    });
    toast('Kupón vytvorený');
    setCreating(false);
    setForm({ code: '', type: 'percentage', value: '', min_order: '', max_uses: '', valid_from: '', valid_until: '' });
    router.refresh();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ is_active: !active }).eq('id', id);
    toast(active ? 'Kupón deaktivovaný' : 'Kupón aktivovaný');
    router.refresh();
  };

  const deleteCoupon = async () => {
    if (!deleteId) return;
    await supabase.from('coupons').delete().eq('id', deleteId);
    toast('Kupón vymazaný');
    setDeleteId(null);
    router.refresh();
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold">Kupóny</h1>
        <button onClick={() => setCreating(!creating)} className="btn-primary !text-xs">
          {creating ? 'Zrušiť' : '+ Nový kupón'}
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-sand-200 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-sand-600 mb-1">Kód</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputClass} placeholder="LETO2026" />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Typ</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} className={inputClass}>
                <option value="percentage">Percentá (%)</option>
                <option value="fixed">Fixná suma (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Hodnota</label>
              <input type="number" step="0.01" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Min. objednávka (€)</label>
              <input type="number" step="0.01" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Max. použití</label>
              <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Platný od</label>
              <input type="datetime-local" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-sand-600 mb-1">Platný do</label>
              <input type="datetime-local" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className={inputClass} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary !text-xs w-full">Vytvoriť</button>
            </div>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <EmptyState message="Žiadne kupóny" />
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400 bg-sand-50">
                  <th className="p-3 font-medium">Kód</th>
                  <th className="p-3 font-medium">Typ</th>
                  <th className="p-3 font-medium text-right">Hodnota</th>
                  <th className="p-3 font-medium text-right">Min.</th>
                  <th className="p-3 font-medium text-right">Použití</th>
                  <th className="p-3 font-medium text-right">Platnosť</th>
                  <th className="p-3 font-medium text-center">Stav</th>
                  <th className="p-3 font-medium text-right">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-3 font-mono font-medium">{c.code}</td>
                    <td className="p-3 text-sand-600">{c.type === 'percentage' ? 'Percentá' : 'Fixná'}</td>
                    <td className="p-3 text-right font-medium">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                    <td className="p-3 text-right text-sand-600">{c.min_order ? formatPrice(c.min_order) : '—'}</td>
                    <td className="p-3 text-right">{c.max_uses ? `${c.used_count}/${c.max_uses}` : c.used_count}</td>
                    <td className="p-3 text-right text-xs text-sand-400">
                      {c.valid_until ? formatDate(c.valid_until) : '∞'}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${c.is_active ? 'bg-moss-600' : 'bg-sand-300'}`} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => toggleActive(c.id, c.is_active)} className="px-2 py-1 rounded text-xs text-sand-600 hover:bg-sand-100 transition-colors">
                          {c.is_active ? 'Deaktivovať' : 'Aktivovať'}
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="px-2 py-1 rounded text-xs text-red-500 hover:bg-red-50 transition-colors">Zmazať</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Zmazať kupón?"
        message="Kupón bude natrvalo vymazaný."
        confirmLabel="Zmazať"
        destructive
        onConfirm={deleteCoupon}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
