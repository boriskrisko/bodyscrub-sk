'use client';

import { useState, useMemo } from 'react';
import { Review } from '@/types';
import StarRating from '@/components/ui/StarRating';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, Pagination, EmptyState, useToast } from './AdminUI';
import { formatDate } from '@/lib/utils';

type ReviewWithProduct = Review & { products: { name: string } | null };
const PER_PAGE = 20;

export default function AdminReviews({ reviews }: { reviews: ReviewWithProduct[] }) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (statusFilter === 'pending' && r.is_approved) return false;
      if (statusFilter === 'approved' && !r.is_approved) return false;
      if (ratingFilter > 0 && r.rating !== ratingFilter) return false;
      return true;
    });
  }, [reviews, statusFilter, ratingFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  const approve = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    toast('Recenzia schválená');
    router.refresh();
  };

  const deleteReview = async () => {
    if (!deleteId) return;
    await supabase.from('reviews').delete().eq('id', deleteId);
    toast('Recenzia vymazaná');
    setDeleteId(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold">
          Recenzie
          {pendingCount > 0 && <span className="ml-2 text-sm bg-amber-100 text-amber-600 px-2.5 py-0.5 rounded-full">{pendingCount} čakajúcich</span>}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-sand-200 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                  statusFilter === s ? 'bg-moss-600 text-white border-moss-600' : 'border-sand-200 text-sand-600 hover:border-moss-600'
                }`}
              >
                {s === 'all' ? 'Všetky' : s === 'pending' ? 'Čakajúce' : 'Schválené'}
              </button>
            ))}
          </div>
          <select value={ratingFilter} onChange={(e) => { setRatingFilter(Number(e.target.value)); setPage(1); }} className="px-3 py-1.5 rounded-lg border border-sand-200 text-xs outline-none">
            <option value="0">Všetky hodnotenia</option>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
          </select>
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState message="Žiadne recenzie" />
      ) : (
        <div className="space-y-3">
          {paged.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-sand-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{review.name}</span>
                    <StarRating rating={review.rating} size={12} />
                    {!review.is_approved && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Čaká</span>
                    )}
                  </div>
                  <p className="text-xs text-sand-400 mb-2">
                    {review.products?.name || 'Neznámy produkt'} · {formatDate(review.created_at)}
                  </p>
                  {review.text && <p className="text-sm text-sand-700 leading-relaxed">{review.text}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  {!review.is_approved && (
                    <button onClick={() => approve(review.id)} className="px-3 py-1.5 rounded-lg text-xs bg-moss-600 text-white hover:bg-moss-800 transition-colors">
                      Schváliť
                    </button>
                  )}
                  <button onClick={() => setDeleteId(review.id)} className="px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors">
                    Zmazať
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog open={!!deleteId} title="Zmazať recenziu?" message="Recenzia bude natrvalo vymazaná." confirmLabel="Zmazať" destructive onConfirm={deleteReview} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
