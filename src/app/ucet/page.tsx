import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Môj účet',
};

export default async function UcetPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/prihlasenie');

  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[800px] mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-medium mb-2">Môj účet</h1>
      <p className="text-sm text-sand-600 mb-8">{user.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/ucet/objednavky"
          className="bg-white rounded-xl border border-sand-200 p-6 hover:border-moss-600 transition-colors group"
        >
          <div className="font-display text-2xl font-medium text-moss-600 mb-1">
            {orderCount || 0}
          </div>
          <div className="text-sm text-sand-600 group-hover:text-moss-600 transition-colors">
            Objednávky
          </div>
        </Link>

        <Link
          href="/ucet/nastavenia"
          className="bg-white rounded-xl border border-sand-200 p-6 hover:border-moss-600 transition-colors group"
        >
          <div className="text-2xl mb-1">⚙️</div>
          <div className="text-sm text-sand-600 group-hover:text-moss-600 transition-colors">
            Nastavenia
          </div>
        </Link>

        <Link
          href="/produkty"
          className="bg-white rounded-xl border border-sand-200 p-6 hover:border-moss-600 transition-colors group"
        >
          <div className="text-2xl mb-1">🛍️</div>
          <div className="text-sm text-sand-600 group-hover:text-moss-600 transition-colors">
            Pokračovať v nákupe
          </div>
        </Link>
      </div>
    </div>
  );
}
