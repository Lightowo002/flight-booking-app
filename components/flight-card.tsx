'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plane, Clock3, BadgeCheck } from 'lucide-react';
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
  passengers?: number;
  tripType?: string;
  returnDate?: string;
}

export function FlightCard({
  id, from, to, fromCity, toCity, airline,
  departure, arrival, duration, stops, price, image,
  passengers = 1, tripType = 'oneWay', returnDate = '',
}: FlightCardProps) {
  const params = new URLSearchParams({
    flightId: id,
    from, to, fromCity, toCity,
    airline, departure, arrival, duration,
    stops: stops.toString(),
    price: price.toString(),
    image,
    passengers: passengers.toString(),
    tripType,
    ...(returnDate ? { returnDate } : {}),
  });

  return (
    <div className="relative flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:border-accent/50 hover:shadow-xl transition-all">
      {/* Imagen + datos de vuelo */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={image}
          alt={`${fromCity} a ${toCity}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/85 backdrop-blur-sm px-2.5 py-1 rounded-sm">
          <Plane className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium text-foreground">{airline}</span>
        </div>

        {stops === 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600/90 text-white text-xs px-2.5 py-1 rounded-sm font-medium">
            <BadgeCheck className="w-3 h-3" />
            Directo
          </div>
        )}

        <div className="absolute bottom-3 left-4">
          <p className="font-display text-white font-bold text-lg leading-none">{toCity}</p>
        </div>
      </div>

      {/* Perforación con muescas tipo boleto */}
      <div className="relative">
        <span className="ticket-notch !left-0 !top-1/2 !-translate-y-1/2 !-translate-x-1/2"></span>
        <span className="ticket-notch !left-auto !right-0 !top-1/2 !-translate-y-1/2 !translate-x-1/2"></span>
        <div className="ticket-perforation" />
      </div>

      {/* Cuerpo tipo boarding pass */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground tracking-wide">{departure}</p>
            <p className="text-xs text-muted-foreground">{from}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-3">
            <div className="w-full flex items-center gap-1">
              <span className="h-px flex-1 bg-border" />
              <Plane className="w-4 h-4 text-accent rotate-90" />
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
              <Clock3 className="w-3 h-3" />
              {duration}
            </div>
            {stops > 0 && (
              <p className="text-[11px] text-accent mt-0.5">{stops} parada{stops > 1 ? 's' : ''}</p>
            )}
          </div>

          <div className="text-center">
            <p className="font-display text-2xl font-bold text-foreground tracking-wide">{arrival}</p>
            <p className="text-xs text-muted-foreground">{to}</p>
          </div>
        </div>

        {/* Código de barras decorativo */}
        <div className="flex items-end gap-[2px] h-6 mb-5 opacity-60">
          {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,3,1,2,4,3,1,2].map((h, i) => (
            <span key={i} className="bg-foreground/60" style={{ width: '2px', height: `${h * 4}px` }} />
          ))}
        </div>

        {/* Precio y botón */}
        <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {passengers > 1 ? `${passengers} pasajeros` : 'Por persona'}
            </p>
            <p className="font-display text-3xl font-bold text-accent leading-none">
              €{passengers > 1 ? price * passengers : price}
            </p>
            {passengers > 1 && (
              <p className="text-xs text-muted-foreground mt-1">€{price} c/u</p>
            )}
          </div>
          <Link href={`/booking/checkout?${params.toString()}`}>
            <Button>
              Seleccionar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}