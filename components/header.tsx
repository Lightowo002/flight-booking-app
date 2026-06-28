"use client";

import Link from "next/link";
import { Plane, Radio, RefreshCw, Ticket, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  flightCount: number;
}

function getInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0);
  const last = lastName.charAt(0);
  return (first + last).toUpperCase() || "U";
}

export function Header({ isLoading, onRefresh, flightCount }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="p-2.5 rounded-md bg-accent/10 border border-accent/30">
              <Plane className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                Sky<span className="text-accent">Tracker</span>
              </h1>
              <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase">
                Flight Tracking & Booking
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Radio className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground font-medium">
                {flightCount} activos
              </span>
            </div>

            <Link href="/booking">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg transition-colors"
              >
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">Reservar</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="rounded-lg transition-colors"
              title="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {user ? (
              <Link href="/profile" title="Ver perfil">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2 pl-2"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.firstName}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button
                  size="sm"
                  className="rounded-lg"
                >
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}