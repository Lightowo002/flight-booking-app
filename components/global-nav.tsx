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
  { name: 'Home', href: '/', icon: <Home className="w-5 h-5 shrink-0" /> },
  { name: 'Flight Tracker', href: '/tracker', icon: <Map className="w-5 h-5 shrink-0" /> },
  { name: 'Book Flights', href: '/booking', icon: <Ticket className="w-5 h-5 shrink-0" /> },
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
            ? 'bg-primary/10 border border-primary/20 text-primary font-medium'
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
                ? 'bg-primary/10 border-primary/20'
                : 'bg-muted/50 border-border hover:bg-muted'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
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
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Button size="sm" className={`w-full ${collapsed ? 'px-0' : ''}`} asChild aria-label="Sign in">
          <Link href="/auth/login" onClick={onNavigate}>
            <LogIn className="w-4 h-4" />
            {!collapsed && 'Sign In'}
          </Link>
        </Button>
        {!collapsed && (
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/auth/register" onClick={onNavigate}>
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </Button>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Plane className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">SkyTracker</span>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
      <div className="md:hidden h-14" />

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          className="md:hidden fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-background border-r border-border flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">SkyTracker</h1>
              <p className="text-xs text-muted-foreground">Airlines</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => navLink(item, () => setMobileOpen(false)))}
        </nav>
        <div className="p-4 border-t border-border">{accountSection(() => setMobileOpen(false))}</div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-background border-r border-border flex-col transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
        aria-label="Sidebar"
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
            <Link href="/" className="p-2 rounded-lg bg-primary/10 border border-primary/20 hover:opacity-80 transition" aria-label="SkyTracker home">
              <Plane className="w-5 h-5 text-primary" />
            </Link>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
              >
                {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? 'Expand' : 'Collapse'}</TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
          {navItems.map((item) => navLink(item))}
        </nav>

        {/* Account Section */}
        <div className="p-4 border-t border-border">{accountSection()}</div>
      </aside>
    </TooltipProvider>
  );
}
