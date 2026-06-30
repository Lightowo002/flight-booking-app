'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Map, Ticket, Home, LogIn, UserPlus, LogOut, User, Menu, PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useNav } from '@/components/nav-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Inicio', href: '/', icon: <Home className="w-5 h-5 shrink-0" /> },
  { name: 'Seguimiento', href: '/tracker', icon: <Map className="w-5 h-5 shrink-0" /> },
  { name: 'Reservar', href: '/booking', icon: <Ticket className="w-5 h-5 shrink-0" /> },
];

function getInitials(firstName: string, lastName: string) {
  const first = firstName.charAt(0);
  const last = lastName.charAt(0);
  return (first + last).toUpperCase() || 'U';
}

export function GlobalNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useNav();

  // Don't show nav on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const navLink = (item: NavItem, onClick?: () => void) => {
    const active = isActive(item.href);
    const link = (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-4 rounded-lg transition-all ${
          collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
        } ${
          active
            ? 'bg-accent/10 border border-accent/30 text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        {item.icon}
        {!collapsed && <span className="font-medium">{item.name}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.name}</TooltipContent>
        </Tooltip>
      );
    }
    return link;
  };

  const accountSection = (onNavigate?: () => void) => {
    if (user) {
      return (
        <div className="space-y-3">
          <Link
            href="/profile"
            onClick={onNavigate}
            aria-current={isActive('/profile') ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg border transition-colors ${
              collapsed ? 'justify-center p-2' : 'px-3 py-2'
            } ${
              isActive('/profile')
                ? 'bg-accent/10 border-accent/30'
                : 'bg-muted/50 border-border hover:bg-muted'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </Link>
          <Button
            size="sm"
            variant="outline"
            className={`w-full ${collapsed ? 'px-0' : ''}`}
            onClick={() => {
              logout();
              onNavigate?.();
            }}
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && 'Cerrar sesión'}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Button size="sm" className={`w-full ${collapsed ? 'px-0' : ''}`} asChild aria-label="Iniciar sesión">
          <Link href="/auth/login" onClick={onNavigate}>
            <LogIn className="w-4 h-4" />
            {!collapsed && 'Iniciar sesión'}
          </Link>
        </Button>
        {!collapsed && (
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/auth/register" onClick={onNavigate}>
              <UserPlus className="w-4 h-4" />
              Crear cuenta
            </Link>
          </Button>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[2000] flex items-center justify-between bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent/10 border border-accent/30">
            <Plane className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display font-bold text-foreground">SkyTracker</span>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      <div className="md:hidden h-14" />

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          className="md:hidden fixed inset-0 z-[2000] bg-foreground/40 backdrop-blur-sm"
          aria-label="Cerrar menú de navegación"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 z-[2001] h-screen w-72 bg-background border-r border-border flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="p-2 rounded-md bg-accent/10 border border-accent/30">
              <Plane className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground">SkyTracker</h1>
              <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase">Airlines</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Navegación principal">
          {navItems.map((item) => navLink(item, () => setMobileOpen(false)))}
        </nav>
        <div className="p-4 border-t border-border">{accountSection(() => setMobileOpen(false))}</div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-background border-r border-border flex-col transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Barra lateral"
      >
        {/* Logo + toggle */}
        <div className={`flex items-center border-b border-border ${collapsed ? 'flex-col gap-3 p-4' : 'justify-between p-6'}`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Plane className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">SkyTracker</h1>
                <p className="text-xs text-muted-foreground">Airlines</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="p-2 rounded-lg bg-primary/10 border border-primary/20 hover:opacity-80 transition" aria-label="Inicio SkyTracker">
              <Plane className="w-5 h-5 text-primary" />
            </Link>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
                aria-expanded={!collapsed}
              >
                {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? 'Expandir' : 'Contraer'}</TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2" aria-label="Navegación principal">
          {navItems.map((item) => navLink(item))}
        </nav>

        {/* Account Section */}
        <div className="p-4 border-t border-border">{accountSection()}</div>
      </aside>
    </TooltipProvider>
  );
}