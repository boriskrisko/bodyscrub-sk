import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const adminNav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/produkty', label: 'Produkty' },
  { href: '/admin/objednavky', label: 'Objednávky' },
  { href: '/admin/kupony', label: 'Kupóny' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/recenzie', label: 'Recenzie' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/prihlasenie');

  // Check admin role from app_metadata
  const isAdmin = user.app_metadata?.role === 'admin';
  if (!isAdmin) redirect('/ucet');

  return (
    <div className="pt-20 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-sand-200 min-h-[calc(100vh-80px)] p-4 hidden md:block">
          <h2 className="font-display font-medium text-lg mb-4 px-3">Admin</h2>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm text-sand-800 hover:bg-sand-50 hover:text-moss-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b border-sand-200 z-40 px-4 py-2 overflow-x-auto">
          <div className="flex gap-2">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs border border-sand-200 text-sand-800 hover:border-moss-600 hover:text-moss-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 md:mt-0 mt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
