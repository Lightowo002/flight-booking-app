import { LandingHero } from "@/components/landing-hero";
import { HowItWorksSection } from "@/components/landing-how-it-works";
import { PopularFlights } from "@/components/landing-popular-flights";
import { ExperienceSection } from "@/components/landing-experience";
import { FeaturesSection } from "@/components/landing-features";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="pb-20 md:pb-0">
      <LandingHero />
      <HowItWorksSection />
      <PopularFlights />
      <ExperienceSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}