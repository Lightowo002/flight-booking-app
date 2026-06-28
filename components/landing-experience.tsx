"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExperienceSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/airplane-cabin.png"
          alt="Cabina premium SkyTracker"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-xl">
          <span className="gold-rule mb-6"></span>
          <p className="text-accent font-medium text-sm tracking-[0.25em] uppercase mb-4">
            Clase Ejecutiva
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Cada detalle, pensado para tu comodidad
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Asientos reclinables, espacio de sobra y un servicio atento de principio a fin. Descubre por qué quienes vuelan con SkyTracker no vuelven a mirar atrás.
          </p>
          <Link href="/booking">
            <Button size="lg" className="h-13 px-8">
              Explorar clases de vuelo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}