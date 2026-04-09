import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import SettingsForm from '@/components/auth/SettingsForm';

export const metadata: Metadata = {
  title: 'Nastavenia účtu',
};

export default async function NastaveniaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/prihlasenie');

  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[600px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/ucet" className="text-sand-400 hover:text-moss-600 transition-colors">
          ← Účet
        </Link>
        <h1 className="font-display text-3xl font-medium">Nastavenia</h1>
      </div>
      <SettingsForm email={user.email || ''} />
    </div>
  );
}
