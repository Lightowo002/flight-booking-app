"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSkyVisual } from "@/components/landing-hero-visual";

const stats = [
  { value: "500+", label: "Aeropuertos" },
  { value: "120+", label: "Países" },
  { value: "4.9", label: "Valoración media", icon: Star },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32 min-h-[90vh] flex items-center">
      <HeroSkyVisual />

      <div className="container mx-auto px-6">
        <div className="max-w-2xl">
          <span className="gold-rule mb-6"></span>
          <p className="text-accent font-medium text-sm tracking-[0.25em] uppercase mb-4">
            SkyTracker Airlines
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.05]">
            Vuela el mundo con la elegancia que mereces
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Compara rutas, sigue tu vuelo en tiempo real y reserva en segundos. Una experiencia de viaje pensada para quienes valoran su tiempo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/booking">
              <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto">
                Reservar vuelo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/tracker">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base w-full sm:w-auto border-accent/40 hover:bg-accent/10 hover:text-foreground">
                Rastrear vuelos
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 md:gap-12 mt-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-1.5 font-display text-2xl md:text-3xl font-bold text-foreground">
                    {Icon && <Icon className="w-5 h-5 text-accent fill-accent" />}
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground tracking-wide uppercase mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-8 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Pago seguro · Confirmación instantánea · Cancelación flexible</span>
          </div>
        </div>
      </div>
    </section>
  );
}