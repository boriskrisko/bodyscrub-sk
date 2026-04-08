'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="text-moss-100 font-medium text-base">
        Ďakujeme! Skontroluj si email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-[400px] mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tvoj@email.sk"
        required
        className="flex-1 px-5 py-3 rounded-full border border-white/20 bg-white/10 text-sand-100 text-sm outline-none placeholder:text-white/50 focus:border-white/40 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary !bg-ink disabled:opacity-50"
      >
        {status === 'loading' ? '...' : 'Odoslať'}
      </button>
    </form>
  );
}
