"use client";

import { Search, ListChecks, PlaneTakeoff } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Busca tu ruta",
    description: "Indica origen, destino y fechas. Comparamos las mejores opciones al instante."
  },
  {
    number: "02",
    icon: ListChecks,
    title: "Compara y elige",
    description: "Revisa horarios, escalas y precios para encontrar el vuelo perfecto para ti."
  },
  {
    number: "03",
    icon: PlaneTakeoff,
    title: "Reserva y vuela",
    description: "Confirma tu pago de forma segura y recibe tu boleto al instante."
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="gold-rule mx-auto mb-6"></span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Reservar nunca fue tan simple
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tres pasos entre tú y tu próximo destino
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="text-center relative">
                <div className="font-display text-6xl font-bold text-accent/15 mb-2 select-none">
                  {step.number}
                </div>
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto -mt-10 mb-6">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}