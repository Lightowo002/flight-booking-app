import { LandingHero } from "@/components/landing-hero";
import { FeaturesSection } from "@/components/landing-features";
import { PopularFlights } from "@/components/landing-popular-flights";
import { OffersSection } from "@/components/landing-offers";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="pb-20 md:pb-0">
      <LandingHero />
      <FeaturesSection />
      <PopularFlights />
      <OffersSection />
      <Footer />
    </div>
  );
}
