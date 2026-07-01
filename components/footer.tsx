'use client';

import Link from 'next/link';
import { Plane, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-md bg-accent/10 border border-accent/30">
                <Plane className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">SkyTracker</h3>
                <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase">Airlines</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              La plataforma de confianza para el seguimiento y reserva de vuelos. Vuela con seguridad, sigue tu vuelo en tiempo real y ahorra en cada viaje.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/joel_arias_l/" className="text-muted-foreground hover:text-accent transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Producto</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent transition text-sm">
                  Seguimiento de vuelos
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-accent transition text-sm">
                  Reservar vuelos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Mis reservas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Estado de vuelo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:info@skytracker.com" className="text-muted-foreground hover:text-accent transition">
                  info@skytracker.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+34900000000" className="text-muted-foreground hover:text-accent transition">
                  +51 952 859 521
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Centro de Vuelos, Lima, Perú
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 SkyTracker Airlines. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                Privacidad
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                Términos
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}