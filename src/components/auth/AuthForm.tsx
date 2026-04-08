'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setMagicLinkSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/ucet');
        router.refresh();
      }
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Zadajte email');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  };

  if (magicLinkSent) {
    return (
      <div className="text-center bg-white rounded-xl border border-sand-200 p-8">
        <div className="w-12 h-12 rounded-full bg-moss-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-medium mb-2">Skontrolujte email</h2>
        <p className="text-sm text-sand-600">
          {mode === 'register'
            ? 'Poslali sme vám potvrdzovací email.'
            : 'Poslali sme vám prihlasovací odkaz.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sand-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-sand-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-sand-600 mb-1">Heslo</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? '...' : mode === 'login' ? 'Prihlásiť sa' : 'Zaregistrovať sa'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-sand-200" />
        </div>
        <div className="relative flex justify-center text-xs text-sand-400">
          <span className="bg-white px-3">alebo</span>
        </div>
      </div>

      <button
        onClick={handleMagicLink}
        disabled={loading}
        className="btn-outline w-full disabled:opacity-50"
      >
        Prihlásiť sa cez magic link
      </button>

      <p className="text-center text-sm text-sand-600 mt-6">
        {mode === 'login' ? (
          <>
            Nemáte účet?{' '}
            <Link href="/registracia" className="text-moss-600 hover:underline">
              Zaregistrujte sa
            </Link>
          </>
        ) : (
          <>
            Už máte účet?{' '}
            <Link href="/prihlasenie" className="text-moss-600 hover:underline">
              Prihláste sa
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
