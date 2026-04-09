'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-medium mb-3">Niečo sa pokazilo</h1>
        <p className="text-sand-600 text-sm mb-8">
          Ospravedlňujeme sa za nepríjemnosti. Skúste to znova.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary">Skúsiť znova</button>
          <Link href="/" className="btn-outline">Na hlavnú stránku</Link>
        </div>
      </div>
    </div>
  );
}
