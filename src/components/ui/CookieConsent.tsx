'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] bg-white border-t border-sand-200 px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-sand-800">
          Používame cookies na zlepšenie vášho zážitku.{' '}
          <Link href="/ochrana-udajov" className="text-moss-600 hover:underline">
            Viac info
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="btn-outline !py-2 !px-4 !text-xs">
            Odmietnuť
          </button>
          <button onClick={accept} className="btn-primary !py-2 !px-4 !text-xs">
            Prijať
          </button>
        </div>
      </div>
    </div>
  );
}
