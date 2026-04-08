'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ email }: { email: string }) {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Heslo musí mať aspoň 6 znakov');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Heslo bolo úspešne zmenené');
      setNewPassword('');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Profile info */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <h2 className="font-display text-lg font-medium mb-4">Profil</h2>
        <div>
          <label className="block text-sm text-sand-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-sand-50 text-sm text-sand-400"
          />
        </div>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <h2 className="font-display text-lg font-medium mb-4">Zmena hesla</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-sand-600 mb-1">Nové heslo</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-moss-600 text-sm">{message}</p>}
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? '...' : 'Zmeniť heslo'}
          </button>
        </form>
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut} className="btn-outline text-red-500 border-red-200 hover:border-red-500 hover:text-red-500">
        Odhlásiť sa
      </button>
    </div>
  );
}
