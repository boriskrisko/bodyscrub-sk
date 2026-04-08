import { Metadata } from 'next';
import CheckoutForm from '@/components/shop/CheckoutForm';

export const metadata: Metadata = {
  title: 'Pokladňa',
};

export default function PokladnaPage() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[800px] mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-medium mb-8">Pokladňa</h1>
      <CheckoutForm />
    </div>
  );
}
