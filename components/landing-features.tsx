"use client";

import { Globe, Award, Headset, Radio, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Cobertura global",
    description: "Conecta con más de 500 aeropuertos en todo el mundo y sigue cualquier vuelo en tiempo real."
  },
  {
    icon: Award,
    title: "Los mejores precios",
    description: "Tarifas competitivas y ofertas exclusivas en todas las rutas y clases de vuelo."
  },
  {
    icon: Headset,
    title: "Soporte 24/7",
    description: "Nuestro equipo de atención al cliente está disponible siempre que lo necesites."
  },
  {
    icon: Radio,
    title: "Seguimiento en vivo",
    description: "Estado del vuelo, retrasos y puertas de embarque actualizados al instante."
  },
  {
    icon: Zap,
    title: "Reserva en minutos",
    description: "Un proceso simplificado para que reserves tu vuelo sin complicaciones."
  },
  {
    icon: ShieldCheck,
    title: "Pagos protegidos",
    description: "Tus datos viajan protegidos con seguridad de nivel empresarial."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="gold-rule mx-auto mb-6"></span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Por qué elegir SkyTracker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combinamos precisión y elegancia para que viajar sea tan placentero como el destino.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="p-8 rounded-md border border-border bg-card hover:border-accent/40 transition-colors">
                <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}