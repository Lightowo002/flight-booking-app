"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
            Discover the World, One Flight at a Time
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">
            Experience seamless flight tracking and booking with SkyTracker Airlines. Find the best routes, best prices, and best service.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/booking">
              <Button size="lg" className="rounded-lg h-14 px-8 text-base">
                Book a Flight
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/tracker">
              <Button variant="outline" size="lg" className="rounded-lg h-14 px-8 text-base">
                Track Flights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
