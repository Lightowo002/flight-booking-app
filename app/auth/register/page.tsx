import { Plane } from 'lucide-react';
import { RegisterForm } from '@/components/register-form';
import Link from 'next/link';

export const metadata = {
  title: 'Registrarse - SkyTracker',
  description: 'Crea tu cuenta en SkyTracker Airlines',
};

export default function RegisterPage() {
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
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Info */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Únete a SkyTracker
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Crea tu cuenta y comienza a explorar el mundo. Reserva vuelos, rastrealos en tiempo real y disfruta de experiencias de viaje increíbles.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-2xl">🌍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Explora destinos</h3>
                  <p className="text-sm text-muted-foreground">Acceso a miles de rutas</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Mejores precios</h3>
                  <p className="text-sm text-muted-foreground">Ofertas exclusivas para miembros</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Programa de puntos</h3>
                  <p className="text-sm text-muted-foreground">Gana puntos en cada vuelo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex items-center">
            <div className="w-full">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Crear cuenta</h3>
                <p className="text-muted-foreground">Completa el formulario para comenzar</p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
