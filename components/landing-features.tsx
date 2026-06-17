"use client";

import { Globe, Award, Users, BarChart3, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Connect to over 500 airports worldwide with real-time flight tracking"
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive rates and exclusive deals on all routes and flight classes"
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Our customer service team is always ready to help you"
  },
  {
    icon: BarChart3,
    title: "Live Updates",
    description: "Real-time flight status, delays, and gate information"
  },
  {
    icon: Zap,
    title: "Fast Booking",
    description: "Book your flight in minutes with our streamlined process"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your data is protected with enterprise-grade security"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose SkyTracker?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to making your travel experience smooth, affordable, and enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="p-8 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
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
