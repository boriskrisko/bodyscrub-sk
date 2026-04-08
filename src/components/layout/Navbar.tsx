'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCart';

function LeafIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M12 22c0 0 8-4 8-12C20 4 14 2 12 2c-2 0-8 2-8 8 0 8 8 12 8 12z" />
      <path d="M12 22V8" />
      <path d="M8 14c2-2 4-3 4-3" />
      <path d="M16 11c-2 1.5-4 3-4 3" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-sand-50/92 backdrop-blur-xl border-b border-sand-200/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1100px] mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <LeafIcon className="text-moss-600" />
          <span className="font-display font-medium text-lg tracking-wide">
            bodyscrub<span className="text-moss-600">.sk</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center text-sm text-sand-800">
          <Link href="/produkty" className="hover:text-moss-600 transition-colors">
            Produkty
          </Link>
          <Link href="/blog" className="hover:text-moss-600 transition-colors">
            Blog
          </Link>
          <Link href="/o-nas" className="hover:text-moss-600 transition-colors">
            O nás
          </Link>
          <button onClick={toggleCart} className="relative cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-moss-600 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile hamburger + cart */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleCart} className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-moss-600 text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-sand-50/95 backdrop-blur-xl border-t border-sand-200/40 mt-4 py-6 px-6">
          <div className="flex flex-col gap-4 text-base">
            <Link href="/produkty" onClick={() => setMobileOpen(false)} className="hover:text-moss-600 transition-colors">
              Produkty
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="hover:text-moss-600 transition-colors">
              Blog
            </Link>
            <Link href="/o-nas" onClick={() => setMobileOpen(false)} className="hover:text-moss-600 transition-colors">
              O nás
            </Link>
            <Link href="/prihlasenie" onClick={() => setMobileOpen(false)} className="hover:text-moss-600 transition-colors">
              Prihlásenie
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
