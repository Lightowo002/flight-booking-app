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


          </div>
        </div>
      </div>
    </header>
  );
}