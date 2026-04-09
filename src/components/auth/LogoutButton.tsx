'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/prihlasenie');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-sand-500 hover:text-red-500 transition-colors"
    >
      Odhlásiť sa
    </button>
  );
}
