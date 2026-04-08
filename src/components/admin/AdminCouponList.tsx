'use client';

import { useState } from 'react';
import { Coupon } from '@/types';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminCouponList({ coupons }: { coupons: Coupon[] }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_order: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
  });
  const supabase = createClient();
  const router = useRouter();

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
    setCreating(false);
    setForm({ code: '', type: 'percentage', value: '', min_order: '', max_uses: '', valid_from: '', valid_until: '' });
    router.refresh();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ is_active: !active }).eq('id', id);
    router.refresh();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Zmazať kupón?')) return;
    await supabase.from('coupons').delete().eq('id', id);
    router.refresh();
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors';

  return (
    <>
      <button onClick={() => setCreating(!creating)} className="btn-primary mb-6">
        + Nový kupón
      </button>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-sand-200 p-6 mb-6 max-w-lg">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-sand-600 mb-1">Kód</label>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputClass} placeholder="LETO2026" />
              </div>
              <div>
                <label className="block text-xs text-sand-600 mb-1">Typ</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })} className={inputClass}>
                  <option value="percentage">Percentá</option>
                  <option value="fixed">Fixná suma</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-sand-600 mb-1">Hodnota</label>
                <input type="number" step="0.01" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-sand-600 mb-1">Min. objednávka</label>
                <input type="number" step="0.01" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-sand-600 mb-1">Max. použití</label>
                <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-sand-600 mb-1">Platný od</label>
                <input type="datetime-local" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-sand-600 mb-1">Platný do</label>
                <input type="datetime-local" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary !text-xs">Vytvoriť</button>
              <button type="button" onClick={() => setCreating(false)} className="btn-outline !text-xs">Zrušiť</button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white rounded-lg border border-sand-200 p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="font-mono font-medium">{c.code}</div>
              <div className="text-sm text-sand-600">
                {c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)} zľava
                {c.min_order && ` · Min. ${formatPrice(c.min_order)}`}
                {c.max_uses && ` · ${c.used_count}/${c.max_uses} použití`}
                {!c.is_active && <span className="text-red-500 ml-2">Neaktívny</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(c.id, c.is_active)} className="btn-outline !py-1.5 !px-3 !text-xs">
                {c.is_active ? 'Deaktivovať' : 'Aktivovať'}
              </button>
              <button onClick={() => deleteCoupon(c.id)} className="btn-outline !py-1.5 !px-3 !text-xs !border-red-200 !text-red-500">
                Zmazať
              </button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <p className="text-sand-600 text-center py-8">Žiadne kupóny</p>}
      </div>
    </>
  );
}
