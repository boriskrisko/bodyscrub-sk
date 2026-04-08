import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ToastProvider } from '@/components/admin/AdminUI';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/prihlasenie');

  const isAdmin = user.app_metadata?.role === 'admin';
  if (!isAdmin) redirect('/ucet');

  return (
    <ToastProvider>
      <div className="min-h-screen bg-sand-50">
        <AdminSidebar email={user.email || ''} />
        <div className="md:ml-60">
          <main className="p-6 md:p-8 pt-20 md:pt-8 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
