'use client';

import { usePathname } from 'next/navigation';
import { useNav } from '@/components/nav-provider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useNav();
  const pathname = usePathname();

  // Auth pages render full-bleed with no sidebar offset
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <main
      className={`transition-[margin] duration-300 ease-in-out ${
        isAuthPage ? '' : collapsed ? 'md:ml-20' : 'md:ml-64'
      }`}
    >
      {children}
    </main>
  );
}
