'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/hooks/useCart';

export default function ClearCart() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
