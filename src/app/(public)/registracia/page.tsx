import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AuthForm = dynamic(() => import('@/components/auth/AuthForm'), { ssr: false });

export const metadata: Metadata = {
  title: 'Registrácia',
};

export default function RegistraciaPage() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[400px] mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-medium mb-2 text-center">Registrácia</h1>
      <p className="text-sm text-sand-600 text-center mb-8">
        Vytvorte si nový účet
      </p>
      <AuthForm mode="register" />
    </div>
  );
}
