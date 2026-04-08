'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user?.id || null,
      name,
      rating,
      text: text || null,
      is_approved: false,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setName('');
      setRating(5);
      setText('');
      router.refresh();
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-moss-50 rounded-xl p-6 border border-moss-200 text-center">
        <p className="text-moss-600 font-medium">Ďakujeme za recenziu!</p>
        <p className="text-sm text-sand-600 mt-1">Bude zobrazená po schválení.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-sand-200">
      <h3 className="font-display text-lg font-medium mb-4">Napíšte recenziu</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-sand-600 mb-1">Meno</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-sand-600 mb-2">Hodnotenie</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill={s <= rating ? '#C4A97D' : 'none'}
                  stroke="#C4A97D"
                  strokeWidth="2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-sand-600 mb-1">Recenzia (voliteľné)</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-500 text-sm">Chyba pri odosielaní. Prihláste sa a skúste znova.</p>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
          {status === 'loading' ? 'Odosielam...' : 'Odoslať recenziu'}
        </button>
      </div>
    </form>
  );
}
