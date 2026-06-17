import { Metadata } from 'next';
import { FlightCard } from '@/components/flight-card';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Search Results - SkyTracker',
  description: 'Available flights',
};

const mockFlights = [
  {
    id: '1',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'Iberia Express',
    departure: '08:30',
    arrival: '10:15',
    duration: '1h 45m',
    stops: 0,
    price: 89,
    image: '/images/destination-paris.png',
  },
  {
    id: '2',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'Vueling',
    departure: '12:00',
    arrival: '13:45',
    duration: '1h 45m',
    stops: 0,
    price: 65,
    image: '/images/airplane-cabin.png',
  },
  {
    id: '3',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'Air Europa',
    departure: '15:30',
    arrival: '17:15',
    duration: '1h 45m',
    stops: 0,
    price: 95,
    image: '/images/destination-tokyo.png',
  },
  {
    id: '4',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'SkyTracker Airlines',
    departure: '19:00',
    arrival: '20:45',
    duration: '1h 45m',
    stops: 0,
    price: 72,
    image: '/images/destination-dubai.png',
  },
  {
    id: '5',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'Iberia',
    departure: '07:00',
    arrival: '08:45',
    duration: '1h 45m',
    stops: 0,
    price: 120,
    image: '/images/airplane-cabin.png',
  },
  {
    id: '6',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    airline: 'EasyJet',
    departure: '21:30',
    arrival: '23:15',
    duration: '1h 45m',
    stops: 0,
    price: 58,
    image: '/images/destination-paris.png',
  },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Flights</h1>
          <p className="text-muted-foreground">Found {mockFlights.length} flights for your search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFlights.map((flight) => (
            <FlightCard key={flight.id} {...flight} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
