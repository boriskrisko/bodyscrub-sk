'use client';

import { Review } from '@/types';
import StarRating from '@/components/ui/StarRating';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type ReviewWithProduct = Review & { products: { name: string } | null };

export default function AdminReviewList({ reviews }: { reviews: ReviewWithProduct[] }) {
  const supabase = createClient();
  const router = useRouter();

  const approve = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    router.refresh();
  };

  const reject = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg border border-sand-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{review.name}</span>
                <StarRating rating={review.rating} size={12} />
                {!review.is_approved && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                    Čaká na schválenie
                  </span>
                )}
              </div>
              <p className="text-xs text-sand-400 mb-1">
                {review.products?.name || 'Neznámy produkt'} · {new Date(review.created_at).toLocaleDateString('sk-SK')}
              </p>
              {review.text && (
                <p className="text-sm text-sand-800">{review.text}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {!review.is_approved && (
                <button onClick={() => approve(review.id)} className="btn-primary !py-1.5 !px-3 !text-xs">
                  Schváliť
                </button>
              )}
              <button onClick={() => reject(review.id)} className="btn-outline !py-1.5 !px-3 !text-xs !border-red-200 !text-red-500">
                Zmazať
              </button>
            </div>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p className="text-sand-600 text-center py-8">Žiadne recenzie</p>}
    </div>
  );
}
