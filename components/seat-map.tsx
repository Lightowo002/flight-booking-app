'use client';

import { useMemo } from 'react';
import { Crown, Briefcase, Star, Armchair } from 'lucide-react';

export interface SeatInfo {
  id: string;
  cabin: CabinId;
  price: number;
}

type CabinId = 'first' | 'business' | 'premium' | 'economy';

interface CabinConfig {
  id: CabinId;
  name: string;
  description: string;
  rows: number[];
  columns: string[];
  price: number;
  icon: React.ReactNode;
}

const cabins: CabinConfig[] = [
  {
    id: 'first',
    name: 'First / VIP',
    description: 'Asientos cama, máxima privacidad',
    rows: [1, 2],
    columns: ['A', 'C', 'D', 'F'],
    price: 320,
    icon: <Crown className="w-4 h-4" />,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Espacio amplio y servicio premium',
    rows: [3, 4, 5],
    columns: ['A', 'C', 'D', 'F'],
    price: 180,
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: 'premium',
    name: 'Premium Economy',
    description: 'Más espacio para las piernas',
    rows: [6, 7, 8],
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    price: 80,
    icon: <Star className="w-4 h-4" />,
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'La mejor relación calidad-precio',
    rows: [9, 10, 11, 12, 13, 14],
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],
    price: 0,
    icon: <Armchair className="w-4 h-4" />,
  },
];

interface SeatMapProps {
  requiredSeats: number;
  selectedSeats: string[];
  onToggleSeat: (seat: SeatInfo) => void;
  occupiedSeats?: string[]; // ← viene del backend
}

export function SeatMap({ requiredSeats, selectedSeats, onToggleSeat, occupiedSeats = [] }: SeatMapProps) {
  const occupiedSet = useMemo(() => new Set(occupiedSeats), [occupiedSeats]);

  const seatToCabin = useMemo(() => {
    const map = new Map<string, CabinConfig>();
    for (const cabin of cabins) {
      for (const row of cabin.rows) {
        for (const col of cabin.columns) {
          map.set(`${row}${col}`, cabin);
        }
      }
    }
    return map;
  }, []);

  const handleClick = (seatId: string) => {
    if (occupiedSet.has(seatId)) return;
    const cabin = seatToCabin.get(seatId);
    if (!cabin) return;
    const isSelected = selectedSeats.includes(seatId);
    if (!isSelected && selectedSeats.length >= requiredSeats) return;
    onToggleSeat({ id: seatId, cabin: cabin.id, price: cabin.price });
  };

  const totalSeats = cabins.reduce((sum, c) => sum + c.rows.length * c.columns.length, 0);
  const occupiedCount = occupiedSeats.length;

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-muted border border-border" />
          <span className="text-muted-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary border border-primary" />
          <span className="text-muted-foreground">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-secondary border border-border opacity-50" />
          <span className="text-muted-foreground">Ocupado</span>
        </div>
        {occupiedCount > 0 && (
          <span className="ml-auto text-muted-foreground">
            {totalSeats - occupiedCount} disponibles · {occupiedCount} ocupados
          </span>
        )}
      </div>

      {/* Aircraft nose */}
      <div className="flex justify-center">
        <div className="text-xs text-muted-foreground bg-muted px-6 py-1.5 rounded-t-full border border-b-0 border-border">
          Frente del avión
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4 md:p-6 space-y-8">
        {cabins.map((cabin) => (
          <div key={cabin.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  {cabin.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{cabin.name}</p>
                  <p className="text-xs text-muted-foreground">{cabin.description}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-primary whitespace-nowrap">
                {cabin.price === 0 ? 'Incluido' : `+€${cabin.price}`}
              </span>
            </div>

            <div className="space-y-2">
              {cabin.rows.map((row) => {
                const half = Math.ceil(cabin.columns.length / 2);
                const left = cabin.columns.slice(0, half);
                const right = cabin.columns.slice(half);
                return (
                  <div key={row} className="flex items-center justify-center gap-3">
                    <span className="w-5 text-[10px] text-muted-foreground text-right">{row}</span>
                    <div className="flex gap-1.5">
                      {left.map((col) => (
                        <SeatButton
                          key={`${row}${col}`}
                          seatId={`${row}${col}`}
                          occupied={occupiedSet.has(`${row}${col}`)}
                          selected={selectedSeats.includes(`${row}${col}`)}
                          onClick={handleClick}
                        />
                      ))}
                    </div>
                    <span className="w-4" />
                    <div className="flex gap-1.5">
                      {right.map((col) => (
                        <SeatButton
                          key={`${row}${col}`}
                          seatId={`${row}${col}`}
                          occupied={occupiedSet.has(`${row}${col}`)}
                          selected={selectedSeats.includes(`${row}${col}`)}
                          onClick={handleClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatButton({
  seatId,
  occupied,
  selected,
  onClick,
}: {
  seatId: string;
  occupied: boolean;
  selected: boolean;
  onClick: (seatId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(seatId)}
      disabled={occupied}
      aria-label={`Asiento ${seatId}${occupied ? ' ocupado' : selected ? ' seleccionado' : ''}`}
      aria-pressed={selected}
      className={`w-8 h-8 rounded-md text-[10px] font-medium border transition-all ${
        occupied
          ? 'bg-secondary border-border text-muted-foreground opacity-50 cursor-not-allowed'
          : selected
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-muted border-border text-muted-foreground hover:border-primary hover:text-foreground'
      }`}
    >
      {seatId.slice(-1)}
    </button>
  );
}