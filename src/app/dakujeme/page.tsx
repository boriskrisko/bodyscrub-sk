import { Metadata } from 'next';
import Link from 'next/link';
import ClearCart from '@/components/shop/ClearCart';

export const metadata: Metadata = {
  title: 'Ďakujeme za objednávku',
};

export default function DakujemePage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[600px] mx-auto min-h-screen text-center">
      <ClearCart />
      <div className="bg-white rounded-xl border border-sand-200 p-10 mt-8">
        <div className="w-16 h-16 rounded-full bg-moss-100 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-medium mb-3">Ďakujeme!</h1>
        <p className="text-sand-600 mb-2">
          Vaša objednávka bola úspešne prijatá.
        </p>
        <p className="text-sm text-sand-400 mb-8">
          Potvrdenie sme odoslali na váš email.
        </p>
        {searchParams.session_id && (
          <p className="text-xs text-sand-400 mb-6 break-all">
            ID: {searchParams.session_id}
          </p>
        )}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/produkty" className="btn-primary">
            Pokračovať v nákupe
          </Link>
          <Link href="/ucet/objednavky" className="btn-outline">
            Moje objednávky
          </Link>
        </div>
      </div>
    </div>
  );
}
