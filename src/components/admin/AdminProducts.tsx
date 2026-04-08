'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SearchInput, Pagination, ConfirmDialog, EmptyState, useToast, useDebounce } from './AdminUI';
import AdminProductForm from './AdminProductForm';
import { CATEGORIES } from '@/lib/constants';

const PER_PAGE = 20;

export default function AdminProducts({ initialProducts }: { initialProducts: Product[] }) {
  const [products] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sort, setSort] = useState<'newest' | 'name' | 'price-asc' | 'price-desc' | 'stock'>('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.slug.includes(q)) return false;
      }
      if (category !== 'all' && p.category !== category) return false;
      if (statusFilter === 'active' && !p.is_active) return false;
      if (statusFilter === 'inactive' && p.is_active) return false;
      return true;
    });

    switch (sort) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'stock': result.sort((a, b) => a.stock - b.stock); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [products, debouncedSearch, category, statusFilter, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((p) => p.id)));
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    toast('Produkt vymazaný');
    setDeleteConfirm(null);
    router.refresh();
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selected.size === 0) return;
    const ids = Array.from(selected);

    if (bulkAction === 'activate') {
      await supabase.from('products').update({ is_active: true }).in('id', ids);
      toast(`${ids.length} produktov aktivovaných`);
    } else if (bulkAction === 'deactivate') {
      await supabase.from('products').update({ is_active: false }).in('id', ids);
      toast(`${ids.length} produktov deaktivovaných`);
    } else if (bulkAction === 'delete') {
      await supabase.from('products').delete().in('id', ids);
      toast(`${ids.length} produktov vymazaných`);
    }
    setSelected(new Set());
    setBulkAction(null);
    router.refresh();
  };

  const handleDuplicate = async (product: Product) => {
    await supabase.from('products').insert({
      name: `${product.name} (kópia)`,
      slug: `${product.slug}-copy-${Date.now()}`,
      description: product.description,
      short_description: product.short_description,
      price: product.price,
      compare_price: product.compare_price,
      category: product.category,
      tags: product.tags,
      weight_grams: product.weight_grams,
      ingredients: product.ingredients,
      images: product.images,
      stock: product.stock,
      is_active: false,
      is_featured: false,
      seo_title: product.seo_title,
      seo_description: product.seo_description,
    });
    toast('Produkt duplikovaný');
    router.refresh();
  };

  if (creating || editing) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">
          {editing ? 'Upraviť produkt' : 'Nový produkt'}
        </h1>
        <AdminProductForm
          product={editing || undefined}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="font-display text-2xl font-semibold">Produkty</h1>
        <button onClick={() => setCreating(true)} className="btn-primary !text-xs">
          + Nový produkt
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-sand-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Hľadať produkt..." />
          </div>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none">
            <option value="all">Všetky kategórie</option>
            {CATEGORIES.filter(c => c.key !== 'all').map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }} className="px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none">
            <option value="all">Všetky stavy</option>
            <option value="active">Aktívne</option>
            <option value="inactive">Neaktívne</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none">
            <option value="newest">Najnovšie</option>
            <option value="name">Názov</option>
            <option value="price-asc">Cena ↑</option>
            <option value="price-desc">Cena ↓</option>
            <option value="stock">Sklad</option>
          </select>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-sand-100">
            <span className="text-xs text-sand-600">{selected.size} vybraných</span>
            <button onClick={() => setBulkAction('activate')} className="text-xs text-moss-600 hover:underline">Aktivovať</button>
            <button onClick={() => setBulkAction('deactivate')} className="text-xs text-sand-600 hover:underline">Deaktivovať</button>
            <button onClick={() => setBulkAction('delete')} className="text-xs text-red-500 hover:underline">Zmazať</button>
          </div>
        )}
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState message="Žiadne produkty" />
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400 bg-sand-50">
                  <th className="p-3 w-10">
                    <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} className="rounded" />
                  </th>
                  <th className="p-3 font-medium">Produkt</th>
                  <th className="p-3 font-medium">Kategória</th>
                  <th className="p-3 font-medium text-right">Cena</th>
                  <th className="p-3 font-medium text-right">Sklad</th>
                  <th className="p-3 font-medium text-center">Stav</th>
                  <th className="p-3 font-medium text-right">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {paged.map((p) => (
                  <tr key={p.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-sand-400">/{p.slug}</div>
                    </td>
                    <td className="p-3 text-sand-600">{p.category}</td>
                    <td className="p-3 text-right">
                      <span className="font-medium">{formatPrice(p.price)}</span>
                      {p.compare_price && (
                        <span className="text-xs text-sand-400 line-through ml-1">{formatPrice(p.compare_price)}</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className={p.stock === 0 ? 'text-red-500 font-medium' : p.stock < 10 ? 'text-amber-600' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${p.is_active ? 'bg-moss-600' : 'bg-sand-300'}`} title={p.is_active ? 'Aktívny' : 'Neaktívny'} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => setEditing(p)} className="px-2 py-1 rounded text-xs text-sand-600 hover:bg-sand-100 transition-colors">Upraviť</button>
                        <button onClick={() => handleDuplicate(p)} className="px-2 py-1 rounded text-xs text-sand-600 hover:bg-sand-100 transition-colors">Duplikovať</button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="px-2 py-1 rounded text-xs text-red-500 hover:bg-red-50 transition-colors">Zmazať</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-sand-100 text-xs text-sand-400 flex justify-between items-center">
            <span>{filtered.length} produktov</span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Zmazať produkt?"
        message="Produkt bude natrvalo vymazaný. Táto akcia sa nedá vrátiť."
        confirmLabel="Zmazať"
        destructive
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmDialog
        open={!!bulkAction}
        title={`Hromadná akcia: ${bulkAction === 'activate' ? 'aktivovať' : bulkAction === 'deactivate' ? 'deaktivovať' : 'zmazať'}`}
        message={`Akcia sa vykoná na ${selected.size} produktoch.`}
        confirmLabel="Potvrdiť"
        destructive={bulkAction === 'delete'}
        onConfirm={handleBulkAction}
        onCancel={() => setBulkAction(null)}
      />
    </div>
  );
}
