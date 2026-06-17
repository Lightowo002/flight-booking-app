import { Metadata } from 'next';
import { FlightSearchBar } from '@/components/flight-search-bar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Book Flights - SkyTracker',
  description: 'Book your flights with the best prices',
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <FlightSearchBar />
      <Footer />
    </div>
  );
}
