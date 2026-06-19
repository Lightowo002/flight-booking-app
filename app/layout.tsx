import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { NavProvider } from '@/components/nav-provider'
import { GlobalNav } from '@/components/global-nav'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const GOOGLE_CLIENT_ID = '829046570930-bp5aupuas7kup7h4q9jensc90lt02k5h.apps.googleusercontent.com';

export const metadata: Metadata = {
  title: 'SkyTracker - Flight Tracking & Booking',
  description: 'Track flights in real-time and book your perfect journey with SkyTracker Airlines',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-background text-foreground">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider>
            <AuthProvider>
              <NavProvider>
                <GlobalNav />
                <AppShell>
                  {children}
                </AppShell>
              </NavProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}