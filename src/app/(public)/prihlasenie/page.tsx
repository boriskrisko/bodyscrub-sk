import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AuthForm = dynamic(() => import('@/components/auth/AuthForm'), { ssr: false });

export const metadata: Metadata = {
  title: 'Prihlásenie',
};

export default function PrihlaseniePage() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[400px] mx-auto min-h-screen">
      <h1 className="font-display text-3xl font-medium mb-2 text-center">Prihlásenie</h1>
      <p className="text-sm text-sand-600 text-center mb-8">
        Prihláste sa do svojho účtu
      </p>
      <AuthForm mode="login" />
    </div>
  );
}
