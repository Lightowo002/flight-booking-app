"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularRoutes = [
  {
    from: "Madrid (MAD)",
    to: "Barcelona (BCN)",
    image: "/images/destination-paris.png",
    price: "$58",
    duration: "2h 15m",
    airline: "Iberia"
  },
  {
    from: "London (LHR)",
    to: "Dubai (DXB)",
    image: "/images/destination-dubai.png",
    price: "$89",
    duration: "7h 30m",
    airline: "British Airways"
  },
  {
    from: "Frankfurt (FRA)",
    to: "Tokyo (NRT)",
    image: "/images/destination-tokyo.png",
    price: "$120",
    duration: "11h 45m",
    airline: "Lufthansa"
  }
];

export function PopularFlights() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Popular Routes
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our most booked destinations
            </p>
          </div>
          <Link href="/booking">
            <Button variant="outline" size="lg" className="rounded-lg gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={route.image}
                  alt={route.to}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {route.from} → {route.to}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {route.price}
                  </h3>
                </div>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                  <span className="text-sm text-muted-foreground">{route.duration}</span>
                  <span className="text-sm font-medium text-primary">{route.airline}</span>
                </div>

                <Link href="/booking">
                  <Button className="w-full rounded-lg">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
