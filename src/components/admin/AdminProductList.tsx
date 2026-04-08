'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AdminProductForm from './AdminProductForm';

export default function AdminProductList({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('Naozaj chcete vymazať tento produkt?')) return;
    await supabase.from('products').delete().eq('id', id);
    router.refresh();
  };

  if (creating || editing) {
    return (
      <AdminProductForm
        product={editing || undefined}
        onClose={() => { setEditing(null); setCreating(false); }}
      />
    );
  }

  return (
    <>
      <button onClick={() => setCreating(true)} className="btn-primary mb-6">
        + Nový produkt
      </button>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-lg border border-sand-200 p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-sm text-sand-600">
                {p.category} · {formatPrice(p.price)} · Sklad: {p.stock}
                {!p.is_active && <span className="text-red-500 ml-2">Neaktívny</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(p)} className="btn-outline !py-1.5 !px-3 !text-xs">
                Upraviť
              </button>
              <button onClick={() => handleDelete(p.id)} className="btn-outline !py-1.5 !px-3 !text-xs !border-red-200 !text-red-500 hover:!border-red-500">
                Zmazať
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-sand-600 text-center py-8">Žiadne produkty</p>
        )}
      </div>
    </>
  );
}
