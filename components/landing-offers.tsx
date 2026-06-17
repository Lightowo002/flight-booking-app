"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "Early Bird Special",
    description: "Book 30 days in advance",
    discount: "Up to 40% OFF",
    color: "from-primary/10 to-primary/5"
  },
  {
    title: "Weekend Getaway",
    description: "Travel Friday to Sunday",
    discount: "Up to 30% OFF",
    color: "from-accent/10 to-accent/5"
  },
  {
    title: "Business Class Upgrade",
    description: "Selected routes only",
    discount: "From $199",
    color: "from-blue-500/10 to-blue-400/5"
  }
];

export function OffersSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Exclusive Offers
          </h2>
          <p className="text-lg text-muted-foreground">
            Limited time deals on your favorite destinations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <div
              key={idx}
              className={`relative p-8 rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-all`}
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
                <div className="text-4xl font-bold text-primary mb-2">
                  {offer.discount}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">Instant confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">Free cancellation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">24/7 support</span>
                </div>
              </div>

              <Button className="w-full rounded-lg">
                Claim Offer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
