"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "Reserva anticipada",
    description: "Compra con 30 días de anticipación",
    discount: "Hasta 40% OFF",
    color: "from-primary/10 to-primary/5"
  },
  {
    title: "Escapada de fin de semana",
    description: "Viaja de viernes a domingo",
    discount: "Hasta 30% OFF",
    color: "from-accent/10 to-accent/5"
  },
  {
    title: "Mejora a Clase Ejecutiva",
    description: "Solo en rutas seleccionadas",
    discount: "Desde €199",
    color: "from-blue-500/10 to-blue-400/5"
  }
];

export function OffersSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="gold-rule mx-auto mb-6"></span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ofertas exclusivas
          </h2>
          <p className="text-lg text-muted-foreground">
            Promociones por tiempo limitado en tus destinos favoritos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-md border border-border overflow-hidden group hover:shadow-lg transition-all`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} -z-10`}></div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {offer.title}
                </h3>
                <p className="text-muted-foreground">
                  {offer.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="font-display text-4xl font-bold text-accent mb-2">
                  {offer.discount}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-foreground">Confirmación instantánea</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-foreground">Cancelación gratuita</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent" />
                  <span className="text-sm text-foreground">Soporte 24/7</span>
                </div>
              </div>

              <Button className="w-full">
                Aprovechar oferta
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}