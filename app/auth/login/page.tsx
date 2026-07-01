import { Plane } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import Link from 'next/link';
import { Suspense } from 'react'; // <-- Importación necesaria

export const metadata = {
  title: 'Sign In - SkyTracker',
  description: 'Sign in to your SkyTracker Airlines account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
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

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left side - Info */}
          <div className="hidden lg:flex flex-col justify-center space-y-12">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-6">
                Welcome Back
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sign in to your SkyTracker account to access your bookings, track flights in real-time, and enjoy exclusive member benefits.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-5">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">Real-Time Tracking</h3>
                  <p className="text-muted-foreground">Monitor your flights live with updates</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                  <span className="text-2xl">🎫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">Secure Bookings</h3>
                  <p className="text-muted-foreground">Access all your tickets in one place</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">Exclusive Rewards</h3>
                  <p className="text-muted-foreground">Earn miles and get special discounts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="mb-10">
                <h3 className="text-3xl font-bold text-foreground mb-3">Sign In</h3>
                <p className="text-muted-foreground">Access your SkyTracker account</p>
              </div>
              {/* Aquí envolvemos el LoginForm en Suspense para evitar el error de Next.js */}
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}