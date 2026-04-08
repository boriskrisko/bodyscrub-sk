'use client';

import { useCartStore } from '@/hooks/useCart';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore();
  const total = totalPrice();
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-[199]" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-[360px] max-w-[100vw] bg-sand-50 z-[200] shadow-[-8px_0_40px_rgba(0,0,0,0.1)] p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <span className="font-display text-xl font-medium">Košík</span>
          <button onClick={closeCart} className="text-2xl text-sand-600 hover:text-ink transition-colors">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sand-600 text-sm">Košík je prázdny</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-sand-200">
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-sand-600 mt-0.5">
                    {formatPrice(item.price)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-sand-200 flex items-center justify-center text-xs hover:border-moss-600 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-sand-200 flex items-center justify-center text-xs hover:border-moss-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-sand-400 hover:text-ink text-lg transition-colors ml-2">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-sand-200 pt-4 mt-4">
            {/* Free shipping progress */}
            {remaining > 0 ? (
              <div className="mb-3">
                <div className="flex justify-between text-[11px] text-sand-600 mb-1">
                  <span>Ešte {formatPrice(remaining)} do dopravy zadarmo</span>
                  <span>{Math.round((total / FREE_SHIPPING_THRESHOLD) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-sand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-moss-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-moss-600 font-medium mb-3">
                ✓ Doprava zadarmo!
              </p>
            )}

            <div className="flex justify-between text-base font-medium mb-3">
              <span>Spolu</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/pokladna" onClick={closeCart} className="btn-primary block text-center w-full">
              Objednať
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
