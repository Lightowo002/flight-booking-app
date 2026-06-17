'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Email de recuperación enviado a:', email);
    setSubmitted(true);
    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Correo enviado</h2>
          <p className="text-muted-foreground">
            Hemos enviado un enlace de recuperación a <span className="text-cyan-400 font-semibold">{email}</span>
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">
            Revisa tu correo en los próximos minutos. Si no ves nuestro correo, verifica la carpeta de spam.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={() => {
              setSubmitted(false);
              setEmail('');
            }}
            className="w-full rounded-xl h-11 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold"
          >
            Intentar con otro correo
          </Button>

          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full rounded-xl border-border hover:bg-muted/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Recuperar contraseña</h2>
        <p className="text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 rounded-xl border-border bg-muted/50 focus:bg-muted focus:border-cyan-500/50 transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl h-11 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold transition-all disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
