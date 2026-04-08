import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, SITE_NAME, SITE_URL } from '@/lib/constants';

export default function AdminNastaveniaPage() {
  const stripeConnected = !!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder');
  const resendConnected = !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('dummy');

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Nastavenia</h1>

      <div className="max-w-2xl space-y-6">
        {/* Store info */}
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <h2 className="font-display font-medium mb-4">Obchod</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-sand-400 text-xs">Názov</span>
              <p className="font-medium">{SITE_NAME}</p>
            </div>
            <div>
              <span className="text-sand-400 text-xs">URL</span>
              <p className="font-medium">{SITE_URL}</p>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <h2 className="font-display font-medium mb-4">Doprava</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-sand-400 text-xs">Doprava zadarmo od</span>
              <p className="font-medium">{FREE_SHIPPING_THRESHOLD}€</p>
            </div>
            <div>
              <span className="text-sand-400 text-xs">Cena dopravy</span>
              <p className="font-medium">{SHIPPING_COST}€</p>
            </div>
          </div>
          <p className="text-xs text-sand-400 mt-3">
            Pre zmenu uprav <code className="bg-sand-100 px-1.5 py-0.5 rounded">src/lib/constants.ts</code> a redeploy.
          </p>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <h2 className="font-display font-medium mb-4">Integrácie</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-sand-100">
              <div>
                <p className="font-medium text-sm">Stripe</p>
                <p className="text-xs text-sand-400">Platobná brána</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${stripeConnected ? 'bg-moss-50 text-moss-600' : 'bg-amber-50 text-amber-600'}`}>
                {stripeConnected ? 'Pripojený' : 'Nepripojený'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sand-100">
              <div>
                <p className="font-medium text-sm">Supabase</p>
                <p className="text-xs text-sand-400">Databáza + Auth + Storage</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-moss-50 text-moss-600">Pripojený</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">Resend</p>
                <p className="text-xs text-sand-400">Transakčné emaily</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${resendConnected ? 'bg-moss-50 text-moss-600' : 'bg-amber-50 text-amber-600'}`}>
                {resendConnected ? 'Pripojený' : 'Nepripojený'}
              </span>
            </div>
          </div>
        </div>

        {/* Env vars info */}
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <h2 className="font-display font-medium mb-4">Environment</h2>
          <div className="space-y-2 text-sm">
            {[
              'NEXT_PUBLIC_SUPABASE_URL',
              'NEXT_PUBLIC_SUPABASE_ANON_KEY',
              'SUPABASE_SERVICE_ROLE_KEY',
              'STRIPE_SECRET_KEY',
              'STRIPE_WEBHOOK_SECRET',
              'NEXT_PUBLIC_SITE_URL',
              'RESEND_API_KEY',
            ].map((key) => {
              const val = process.env[key];
              return (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-sand-50">
                  <code className="text-xs text-sand-600">{key}</code>
                  <span className={`w-2 h-2 rounded-full ${val && !val.includes('placeholder') && !val.includes('dummy') ? 'bg-moss-600' : 'bg-sand-300'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
