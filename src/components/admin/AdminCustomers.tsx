'use client';

import { useState, useMemo } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { SearchInput, Pagination, EmptyState, useDebounce } from './AdminUI';

interface CustomerData {
  id: string;
  email: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const PER_PAGE = 20;

export default function AdminCustomers({ customers }: { customers: CustomerData[] }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return customers;
    const q = debouncedSearch.toLowerCase();
    return customers.filter((c) => c.email.toLowerCase().includes(q));
  }, [customers, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Zákazníci</h1>

      <div className="bg-white rounded-xl border border-sand-200 p-4 mb-4">
        <div className="max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Hľadať podľa emailu..." />
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState message="Žiadni zákazníci" />
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 text-left text-xs text-sand-400 bg-sand-50">
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium text-right">Objednávky</th>
                  <th className="p-3 font-medium text-right">Utratené</th>
                  <th className="p-3 font-medium text-right">Registrácia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {paged.map((c) => (
                  <tr key={c.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-3 font-medium">{c.email}</td>
                    <td className="p-3 text-right">{c.order_count}</td>
                    <td className="p-3 text-right font-medium text-moss-600">{formatPrice(c.total_spent)}</td>
                    <td className="p-3 text-right text-sand-400 text-xs">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-sand-100 text-xs text-sand-400 flex justify-between items-center">
            <span>{filtered.length} zákazníkov</span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
