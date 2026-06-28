"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plane, BadgeCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularRoutes = [
  {
    fromCity: "Madrid",
    fromCode: "MAD",
    toCity: "Barcelona",
    toCode: "BCN",
    image: "/images/destination-paris.png",
    price: "58",
    duration: "2h 15m",
    airline: "Iberia",
    flightNo: "IB 1842",
    direct: true,
  },
  {
    fromCity: "Londres",
    fromCode: "LHR",
    toCity: "Dubái",
    toCode: "DXB",
    image: "/images/destination-dubai.png",
    price: "89",
    duration: "7h 30m",
    airline: "British Airways",
    flightNo: "BA 106",
    direct: true,
  },
  {
    fromCity: "Fráncfort",
    fromCode: "FRA",
    toCity: "Tokio",
    toCode: "NRT",
    image: "/images/destination-tokyo.png",
    price: "120",
    duration: "11h 45m",
    airline: "Lufthansa",
    flightNo: "LH 716",
    direct: false,
  }
];

export function PopularFlights() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="gold-rule mb-6"></span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Rutas más populares
            </h2>
            <p className="text-lg text-muted-foreground">
              Descubre los destinos favoritos de nuestros viajeros
            </p>
          </div>
          <Link href="/booking">
            <Button variant="outline" size="lg" className="gap-2 border-accent/40 hover:bg-accent/10">
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {popularRoutes.map((route, idx) => (
            <div
              key={idx}
              className="relative grid grid-rows-[180px_auto] rounded-xl overflow-hidden border border-border bg-card hover:border-accent/50 hover:shadow-xl transition-all group"
            >
              {/* Imagen de destino */}
              <div className="relative overflow-hidden">
                <Image
                  src={route.image}
                  alt={route.toCity}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/85 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                  <Plane className="w-3 h-3 text-accent" />
                  <span className="text-xs font-medium text-foreground">{route.flightNo}</span>
                </div>

                {route.direct && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600/90 text-white text-xs px-2.5 py-1 rounded-sm font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    Directo
                  </div>
                )}

                <div className="absolute bottom-3 left-4">
                  <p className="font-display text-white text-xl font-bold leading-none">{route.toCity}</p>
                  <p className="text-white/75 text-xs">{route.airline}</p>
                </div>
              </div>

              {/* Perforación con muescas tipo boleto */}
              <div className="relative">
                <span className="ticket-notch !left-0 !top-1/2 !-translate-y-1/2 !-translate-x-1/2"></span>
                <span className="ticket-notch !left-auto !right-0 !top-1/2 !-translate-y-1/2 !translate-x-1/2"></span>
                <div className="ticket-perforation" />
              </div>

              {/* Cuerpo tipo boarding pass */}
              <div className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground tracking-wide">{route.fromCode}</p>
                    <p className="text-xs text-muted-foreground">{route.fromCity}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-3">
                    <div className="w-full flex items-center gap-1">
                      <span className="h-px flex-1 bg-border" />
                      <Plane className="w-4 h-4 text-accent rotate-90" />
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                      <Clock3 className="w-3 h-3" />
                      {route.duration}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground tracking-wide">{route.toCode}</p>
                    <p className="text-xs text-muted-foreground">{route.toCity}</p>
                  </div>
                </div>

                {/* Código de barras decorativo */}
                <div className="flex items-end gap-[2px] h-7 mb-5 opacity-70">
                  {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,3,1,2,4,3,1,2].map((h, i) => (
                    <span
                      key={i}
                      className="bg-foreground/60"
                      style={{ width: "2px", height: `${h * 5}px` }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Desde</p>
                    <p className="font-display text-3xl font-bold text-accent leading-none">
                      €{route.price}
                    </p>
                  </div>
                  <Link href="/booking">
                    <Button>
                      Reservar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}