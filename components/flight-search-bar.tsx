'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Users, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFilters {
  fromCode: string;
  fromLabel: string;
  toCode: string;
  toLabel: string;
  departure: string;
  returnDate: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
}

interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
}

const AIRPORTS: Airport[] = [
  { code: 'MAD', city: 'Madrid', country: 'España', name: 'Adolfo Suárez Barajas' },
  { code: 'BCN', city: 'Barcelona', country: 'España', name: 'El Prat' },
  { code: 'VLC', city: 'Valencia', country: 'España', name: 'Manises' },
  { code: 'AGP', city: 'Málaga', country: 'España', name: 'Costa del Sol' },
  { code: 'SVQ', city: 'Sevilla', country: 'España', name: 'San Pablo' },
  { code: 'BIO', city: 'Bilbao', country: 'España', name: 'Loiu' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido', name: 'Heathrow' },
  { code: 'LGW', city: 'Londres', country: 'Reino Unido', name: 'Gatwick' },
  { code: 'CDG', city: 'París', country: 'Francia', name: 'Charles de Gaulle' },
  { code: 'ORY', city: 'París', country: 'Francia', name: 'Orly' },
  { code: 'FRA', city: 'Frankfurt', country: 'Alemania', name: 'Frankfurt am Main' },
  { code: 'MUC', city: 'Múnich', country: 'Alemania', name: 'Franz Josef Strauss' },
  { code: 'BER', city: 'Berlín', country: 'Alemania', name: 'Brandenburg' },
  { code: 'AMS', city: 'Ámsterdam', country: 'Países Bajos', name: 'Schiphol' },
  { code: 'FCO', city: 'Roma', country: 'Italia', name: 'Fiumicino' },
  { code: 'MXP', city: 'Milán', country: 'Italia', name: 'Malpensa' },
  { code: 'ZRH', city: 'Zúrich', country: 'Suiza', name: 'Kloten' },
  { code: 'VIE', city: 'Viena', country: 'Austria', name: 'Schwechat' },
  { code: 'LIS', city: 'Lisboa', country: 'Portugal', name: 'Humberto Delgado' },
  { code: 'OPO', city: 'Oporto', country: 'Portugal', name: 'Francisco Sá Carneiro' },
  { code: 'DXB', city: 'Dubái', country: 'Emiratos Árabes', name: 'Dubai International' },
  { code: 'AUH', city: 'Abu Dabi', country: 'Emiratos Árabes', name: 'Zayed International' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International' },
  { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos', name: 'John F. Kennedy' },
  { code: 'EWR', city: 'Nueva York', country: 'Estados Unidos', name: 'Newark Liberty' },
  { code: 'LAX', city: 'Los Ángeles', country: 'Estados Unidos', name: 'LAX' },
  { code: 'ORD', city: 'Chicago', country: 'Estados Unidos', name: "O'Hare" },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos', name: 'Miami International' },
  { code: 'LIM', city: 'Lima', country: 'Perú', name: 'Jorge Chávez' },
  { code: 'AQP', city: 'Arequipa', country: 'Perú', name: 'Rodríguez Ballón' },
  { code: 'CUZ', city: 'Cusco', country: 'Perú', name: 'Alejandro Velasco Astete' },
  { code: 'TRU', city: 'Trujillo', country: 'Perú', name: 'Carlos Martínez de Pinillos' },
  { code: 'PIU', city: 'Piura', country: 'Perú', name: 'Guillermo Concha Iberico' },
  { code: 'IQT', city: 'Iquitos', country: 'Perú', name: 'Coronel FAP Francisco Secada' },
  { code: 'TPP', city: 'Tarapoto', country: 'Perú', name: 'Cadete FAP Guillermo del Castillo' },
  { code: 'TCQ', city: 'Tacna', country: 'Perú', name: 'Coronel FAP Carlos Ciriani' },
  { code: 'JUL', city: 'Juliaca', country: 'Perú', name: 'Inca Manco Cápac' },
  { code: 'HUZ', city: 'Huánuco', country: 'Perú', name: 'Alférez FAP David Figueroa' },
  { code: 'AYP', city: 'Ayacucho', country: 'Perú', name: 'Alfredo Mendívil Duarte' },
  { code: 'PCL', city: 'Pucallpa', country: 'Perú', name: 'FAP David Abensur Rengifo' },
  { code: 'BOG', city: 'Bogotá', country: 'Colombia', name: 'El Dorado' },
  { code: 'GRU', city: 'São Paulo', country: 'Brasil', name: 'Guarulhos' },
  { code: 'GIG', city: 'Río de Janeiro', country: 'Brasil', name: 'Galeão' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', name: 'Arturo Merino Benítez' },
  { code: 'MEX', city: 'Ciudad de México', country: 'México', name: 'Benito Juárez' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', name: 'Ezeiza' },
  { code: 'UIO', city: 'Quito', country: 'Ecuador', name: 'Mariscal Sucre' },
  { code: 'NRT', city: 'Tokyo', country: 'Japón', name: 'Narita' },
  { code: 'HND', city: 'Tokyo', country: 'Japón', name: 'Haneda' },
  { code: 'ICN', city: 'Seúl', country: 'Corea del Sur', name: 'Incheon' },
  { code: 'PEK', city: 'Pekín', country: 'China', name: 'Capital International' },
  { code: 'PVG', city: 'Shanghái', country: 'China', name: 'Pudong' },
  { code: 'SIN', city: 'Singapur', country: 'Singapur', name: 'Changi' },
  { code: 'BKK', city: 'Bangkok', country: 'Tailandia', name: 'Suvarnabhumi' },
  { code: 'SYD', city: 'Sídney', country: 'Australia', name: 'Kingsford Smith' },
  { code: 'JNB', city: 'Johannesburgo', country: 'Sudáfrica', name: 'OR Tambo' },
  { code: 'CAI', city: 'El Cairo', country: 'Egipto', name: 'Cairo International' },
  { code: 'IST', city: 'Estambul', country: 'Türkiye', name: 'Istanbul Airport' },
  { code: 'ATH', city: 'Atenas', country: 'Grecia', name: 'Eleftherios Venizelos' },
  { code: 'CPH', city: 'Copenhague', country: 'Dinamarca', name: 'Kastrup' },
  { code: 'ARN', city: 'Estocolmo', country: 'Suecia', name: 'Arlanda' },
  { code: 'OSL', city: 'Oslo', country: 'Noruega', name: 'Gardermoen' },
  { code: 'HEL', city: 'Helsinki', country: 'Finlandia', name: 'Vantaa' },
  { code: 'BRU', city: 'Bruselas', country: 'Bélgica', name: 'Zaventem' },
  { code: 'PRG', city: 'Praga', country: 'República Checa', name: 'Václav Havel' },
  { code: 'WAW', city: 'Varsovia', country: 'Polonia', name: 'Chopin' },
  { code: 'BUD', city: 'Budapest', country: 'Hungría', name: 'Ferenc Liszt' },
];

function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return AIRPORTS.filter((a) => {
    const city = a.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const country = a.country.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const name = a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
      a.code.toLowerCase().includes(q) ||
      city.includes(q) ||
      country.includes(q) ||
      name.includes(q)
    );
  }).slice(0, 6);
}

// ——— Componente de campo con autocomplete ———
interface AirportInputProps {
  label: string;
  value: string;
  onChange: (code: string, label: string) => void;
  error?: string;
  excludeCode?: string;
}

function AirportInput({ label, value, onChange, error, excludeCode }: AirportInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sincronizar si el padre cambia el valor (ej: rutas populares)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const results = searchAirports(val).filter((a) => a.code !== excludeCode);
    setSuggestions(results);
    setOpen(results.length > 0);
    // Si el usuario borra, limpiar selección
    if (!val) onChange('', '');
  };

  const handleSelect = (airport: Airport) => {
    const label = `${airport.city} (${airport.code})`;
    setInputValue(label);
    onChange(airport.code, label);
    setSuggestions([]);
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('', '');
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      <div
        className={`flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border transition-colors ${
          error ? 'border-red-500' : focused ? 'border-primary' : 'border-border'
        }`}
      >
        <MapPin size={18} className="text-primary shrink-0" />
        <Input
          type="text"
          placeholder="Ciudad o código (ej: Lima, MAD...)"
          value={inputValue}
          onChange={handleInput}
          onFocus={() => {
            setFocused(true);
            if (inputValue.length >= 2) {
              const results = searchAirports(inputValue).filter((a) => a.code !== excludeCode);
              setSuggestions(results);
              setOpen(results.length > 0);
            }
          }}
          className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 h-auto shadow-none text-sm"
          autoComplete="off"
        />
        {inputValue && (
          <button type="button" onClick={handleClear} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X size={14} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* Dropdown de sugerencias */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {suggestions.map((airport) => (
            <button
              key={airport.code}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // evitar que onBlur cierre antes
              onClick={() => handleSelect(airport)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-xs">{airport.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-semibold text-sm truncate">
                  {airport.city}
                  <span className="text-muted-foreground font-normal"> — {airport.name}</span>
                </p>
                <p className="text-muted-foreground text-xs">{airport.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ——— Componente principal ———
const popularRoutes = [
  { from: 'MAD', fromLabel: 'Madrid (MAD)', to: 'BCN', toLabel: 'Barcelona (BCN)', name: 'Madrid → Barcelona' },
  { from: 'LHR', fromLabel: 'Londres (LHR)', to: 'CDG', toLabel: 'París (CDG)', name: 'Londres → París' },
  { from: 'FRA', fromLabel: 'Frankfurt (FRA)', to: 'HND', toLabel: 'Tokyo (HND)', name: 'Frankfurt → Tokyo' },
  { from: 'LIM', fromLabel: 'Lima (LIM)', to: 'BOG', toLabel: 'Bogotá (BOG)', name: 'Lima → Bogotá' },
];

export function FlightSearchBar({ embedded = false }: { embedded?: boolean } = {}) {
  const [filters, setFilters] = useState({
    fromCode: 'MAD',
    fromLabel: 'Madrid (MAD)',
    toCode: 'BCN',
    toLabel: 'Barcelona (BCN)',
    departure: '',
    returnDate: '',
    passengers: 1,
    tripType: 'oneWay' as 'oneWay' | 'roundTrip',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!filters.fromCode) e.from = 'Selecciona un aeropuerto de origen';
    if (!filters.toCode) e.to = 'Selecciona un aeropuerto de destino';
    if (filters.fromCode && filters.fromCode === filters.toCode) e.to = 'El destino debe ser diferente al origen';
    if (!filters.departure) e.departure = 'Selecciona fecha de salida';
    if (filters.tripType === 'roundTrip' && !filters.returnDate) e.returnDate = 'Selecciona fecha de vuelta';
    if (filters.tripType === 'roundTrip' && filters.returnDate && filters.departure && filters.returnDate < filters.departure) {
      e.returnDate = 'La vuelta debe ser después de la salida';
    }
    return e;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const params = new URLSearchParams({
      from: filters.fromCode,
      to: filters.toCode,
      departure: filters.departure,
      passengers: filters.passengers.toString(),
      tripType: filters.tripType,
      ...(filters.tripType === 'roundTrip' && filters.returnDate ? { returnDate: filters.returnDate } : {}),
    });
    window.location.href = `/booking/results?${params.toString()}`;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={embedded ? "w-full" : "w-full bg-background py-12 px-4"}>
      <div className={embedded ? "w-full" : "max-w-6xl mx-auto"}>
        {!embedded && (
          <>
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Busca tu vuelo</h1>
            <p className="text-muted-foreground mb-8">Los mejores precios en vuelos internacionales</p>
          </>
        )}

        <form onSubmit={handleSearch} className={embedded ? "bg-card rounded-md p-5 md:p-6 border border-border shadow-xl space-y-5" : "bg-card rounded-2xl p-6 border border-border space-y-6"}>
          {/* Trip Type */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="oneWay"
                checked={filters.tripType === 'oneWay'}
                onChange={() => setFilters({ ...filters, tripType: 'oneWay', returnDate: '' })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Solo ida</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="roundTrip"
                checked={filters.tripType === 'roundTrip'}
                onChange={() => setFilters({ ...filters, tripType: 'roundTrip' })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-foreground">Ida y vuelta</span>
            </label>
          </div>

          {/* Search Fields */}
          <div className={`grid gap-4 ${filters.tripType === 'roundTrip' ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'}`}>
            <AirportInput
              label="Desde"
              value={filters.fromLabel}
              onChange={(code, label) => setFilters((f) => ({ ...f, fromCode: code, fromLabel: label }))}
              error={errors.from}
              excludeCode={filters.toCode}
            />
            <AirportInput
              label="Hacia"
              value={filters.toLabel}
              onChange={(code, label) => setFilters((f) => ({ ...f, toCode: code, toLabel: label }))}
              error={errors.to}
              excludeCode={filters.fromCode}
            />

            {/* Departure */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Salida</label>
              <div className={`flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border ${errors.departure ? 'border-red-500' : 'border-border'}`}>
                <Calendar size={18} className="text-primary shrink-0" />
                <Input
                  type="date"
                  min={today}
                  value={filters.departure}
                  onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
                  className="bg-transparent border-0 text-foreground focus-visible:ring-0 p-0 h-auto shadow-none text-sm"
                />
              </div>
              {errors.departure && <p className="text-red-500 text-xs mt-1">{errors.departure}</p>}
            </div>

            {/* Return Date */}
            {filters.tripType === 'roundTrip' && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Vuelta</label>
                <div className={`flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border ${errors.returnDate ? 'border-red-500' : 'border-border'}`}>
                  <Calendar size={18} className="text-primary shrink-0" />
                  <Input
                    type="date"
                    min={filters.departure || today}
                    value={filters.returnDate}
                    onChange={(e) => setFilters({ ...filters, returnDate: e.target.value })}
                    className="bg-transparent border-0 text-foreground focus-visible:ring-0 p-0 h-auto shadow-none text-sm"
                  />
                </div>
                {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
              </div>
            )}

            {/* Passengers */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Pasajeros</label>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3 border border-border">
                <Users size={18} className="text-primary shrink-0" />
                <Input
                  type="number"
                  min="1"
                  max="9"
                  value={filters.passengers}
                  onChange={(e) => setFilters({ ...filters, passengers: Math.max(1, Math.min(9, parseInt(e.target.value) || 1)) })}
                  className="bg-transparent border-0 text-foreground focus-visible:ring-0 p-0 h-auto shadow-none text-sm"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
            <Search size={20} />
            Buscar vuelos
          </Button>
        </form>

        {/* Popular Routes */}
        {!embedded && (
        <div className="mt-12">
          <h3 className="text-foreground font-semibold mb-4">Rutas populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {popularRoutes.map((route) => (
              <button
                key={route.name}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    fromCode: route.from,
                    fromLabel: route.fromLabel,
                    toCode: route.to,
                    toLabel: route.toLabel,
                  }))
                }
                className="bg-card hover:bg-muted text-left p-4 rounded-lg border border-border hover:border-primary transition-all text-foreground text-sm"
              >
                <div className="font-semibold">{route.name}</div>
              </button>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}