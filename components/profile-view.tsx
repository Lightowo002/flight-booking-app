'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, User as UserIcon, Plane, Calendar, Phone, IdCard, LogOut, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';

function getInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0);
  const last = lastName.charAt(0);
  return (first + last).toUpperCase() || 'U';
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function ProfileView() {
  const router = useRouter();
  const { user, isReady, logout } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/auth/login');
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const details = [
    {
      icon: <UserIcon className="w-5 h-5 text-primary" />,
      label: 'Full name',
      value: fullName || 'Not provided',
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      label: 'Email address',
      value: user.email,
    },
    {
      icon: <Phone className="w-5 h-5 text-primary" />,
      label: 'Phone',
      value: user.phone || 'Not provided',
    },
    {
      icon: <IdCard className="w-5 h-5 text-primary" />,
      label: 'Document number',
      value: user.numeroDocumento || 'Not provided',
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      label: 'Member since',
      value: user.fechaRegistro ? formatDate(user.fechaRegistro) : 'Not available',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile card */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-primary/10 border-b border-border" />

          <div className="px-6 pb-6">
            {/* Avatar + name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold border-4 border-card shrink-0">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="sm:pb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {fullName || user.email}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Details grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="p-2 rounded-md bg-primary/10 border border-primary/20 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground truncate mt-0.5">
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link
            href="/booking"
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary hover:bg-muted/50 transition-all"
          >
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Book a flight</p>
              <p className="text-sm text-muted-foreground">Find and reserve your next trip</p>
            </div>
          </Link>
          <Link
            href="/tracker"
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary hover:bg-muted/50 transition-all"
          >
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Track flights</p>
              <p className="text-sm text-muted-foreground">Follow live flights in real time</p>
            </div>
          </Link>
        </section>

        {/* Sign out */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}