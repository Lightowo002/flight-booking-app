'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFilters {
  from: string;
  to: string;
  departure: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
}

const popularRoutes = [
  { from: 'MAD', to: 'BCN', name: 'Madrid → Barcelona' },
  { from: 'LHR', to: 'CDG', name: 'Londres → París' },
  { from: 'FRA', to: 'HND', name: 'Frankfurt → Tokyo' },
  { from: 'AE', to: 'DXB', name: 'Abu Dhabi → Dubai' },
];

export function FlightSearchBar() {
  const [filters, setFilters] = useState<SearchFilters>({
    from: 'MAD',
    to: 'BCN',
    departure: '',
    passengers: 1,
    tripType: 'oneWay',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to results page
    const params = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      departure: filters.departure,
      passengers: filters.passengers.toString(),
    });
    window.location.href = `/booking/results?${params.toString()}`;
  };

  return (
    <div className="w-full bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Busca tu vuelo</h1>
        <p className="text-muted-foreground mb-8">Los mejores precios en vuelos internacionales</p>

        <form onSubmit={handleSearch} className="bg-card rounded-2xl p-6 border border-border space-y-6">
          {/* Trip Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="oneWay"
                checked={filters.tripType === 'oneWay'}
                onChange={(e) => setFilters({ ...filters, tripType: e.target.value as any })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Ida</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="roundTrip"
                checked={filters.tripType === 'roundTrip'}
                onChange={(e) => setFilters({ ...filters, tripType: e.target.value as any })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Ida y vuelta</span>
            </label>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* From */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Desde</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border border-border">
                <MapPin size={20} className="text-primary" />
                <Input
                  type="text"
                  placeholder="MAD, LHR..."
                  value={filters.from}
                  onChange={(e) => setFilters({ ...filters, from: e.target.value.toUpperCase() })}
                  className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto shadow-none"
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Hacia</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border border-border">
                <MapPin size={20} className="text-primary" />
                <Input
                  type="text"
                  placeholder="BCN, CDG..."
                  value={filters.to}
                  onChange={(e) => setFilters({ ...filters, to: e.target.value.toUpperCase() })}
                  className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto shadow-none"
                />
              </div>
            </div>

            {/* Departure */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Salida</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border border-border">
                <Calendar size={20} className="text-primary" />
                <Input
                  type="date"
                  value={filters.departure}
                  onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
                  className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto shadow-none"
                />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Pasajeros</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border border-border">
                <Users size={20} className="text-primary" />
                <Input
                  type="number"
                  min="1"
                  max="9"
                  value={filters.passengers}
                  onChange={(e) => setFilters({ ...filters, passengers: parseInt(e.target.value) })}
                  className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto shadow-none"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Buscar vuelos
          </Button>
        </form>

        {/* Popular Routes */}
        <div className="mt-12">
          <h3 className="text-foreground font-semibold mb-4">Rutas populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {popularRoutes.map((route) => (
              <button
                key={route.name}
                type="button"
                onClick={() => {
                  setFilters({ ...filters, from: route.from, to: route.to });
                }}
                className="bg-card hover:bg-muted text-left p-4 rounded-lg border border-border hover:border-primary transition-all text-foreground text-sm"
              >
                <div className="font-semibold">{route.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
