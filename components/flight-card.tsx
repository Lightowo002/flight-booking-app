'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Plane, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlightCardProps {
  id: string;
  from: string;
  to: string;
  fromCity: string;
  toCity: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  image: string;
}

export function FlightCard({ id, from, to, fromCity, toCity, airline, departure, arrival, duration, stops, price, image }: FlightCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={`${fromCity} to ${toCity}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold text-lg">{toCity}</p>
          <p className="text-white/80 text-sm">{airline}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Flight Route */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-foreground">{departure.split(':')[0]}:{departure.split(':')[1]}</p>
            <p className="text-sm text-muted-foreground">{from}</p>
          </div>

          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="w-full h-px bg-border mb-2" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Plane size={14} />
              <span>{duration}</span>
            </div>
            {stops > 0 && <p className="text-xs text-accent">{stops} parada{stops > 1 ? 's' : ''}</p>}
          </div>

          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-foreground">{arrival.split(':')[0]}:{arrival.split(':')[1]}</p>
            <p className="text-sm text-muted-foreground">{to}</p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Desde</p>
            <p className="text-3xl font-bold text-primary">
              €{price}
            </p>
          </div>
          <Link href={`/booking/checkout?flightId=${id}`}>
            <Button>
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
