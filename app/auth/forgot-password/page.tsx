import { Plane } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import Link from 'next/link';

export const metadata = {
  title: 'Recuperar contraseña - SkyTracker',
  description: 'Recupera acceso a tu cuenta de SkyTracker Airlines',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition w-fit">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30">
              <Plane className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              Sky<span className="text-cyan-400">Tracker</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-1 gap-8">
            {/* Form */}
            <div className="max-w-md mx-auto w-full">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
