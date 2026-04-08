import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl font-extralight text-moss-600 mb-4">404</div>
        <h1 className="font-display text-2xl font-medium mb-3">Stránka nenájdená</h1>
        <p className="text-sand-600 text-sm mb-8">
          Hľadaná stránka neexistuje alebo bola presunutá.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Na hlavnú stránku</Link>
          <Link href="/produkty" className="btn-outline">Produkty</Link>
        </div>
      </div>
    </div>
  );
}
