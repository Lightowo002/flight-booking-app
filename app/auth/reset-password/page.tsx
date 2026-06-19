import { Plane } from 'lucide-react';
import { ResetPasswordForm } from '@/components/reset-password-form';
import Link from 'next/link';

export const metadata = {
  title: 'Restablecer contraseña - SkyTracker',
  description: 'Crea una nueva contraseña para tu cuenta de SkyTracker',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-6 border-b border-border">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition w-fit">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground">
              Sky<span className="text-primary">Tracker</span>
            </h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <ResetPasswordForm />
      </main>
    </div>
  );
}