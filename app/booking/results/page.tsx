import { FlightCard } from '@/components/flight-card';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import { CalendarX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resultados - SkyTracker',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118';

interface VueloAPI {
  id: string;
  codigoVuelo: string;
  origen: { ciudad: string; aeropuerto: string; codigoIata: string };
  destino: { ciudad: string; aeropuerto: string; codigoIata: string };
  fechaHoraPartida: string;
  fechaHoraLlegadaEstimada: string;
  duracionMinutos: number;
  estadoActual: string;
  avion: string;
  capacidadPasajeros: number;
  precio: number;
  esFechaAlternativa: boolean;
}

interface ApiResponse {
  vuelos: VueloAPI[];
  esFechaAlternativa: boolean;
  fechaBuscada: string | null;
}

function formatHora(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function formatFechaLarga(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatFechaCorta(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

const IMAGEN_DESTINO: Record<string, string> = {
  Lima: '/images/destination-paris.png',
  Arequipa: '/images/destination-dubai.png',
  Cusco: '/images/destination-tokyo.png',
  Trujillo: '/images/airplane-cabin.png',
  Piura: '/images/destination-paris.png',
  Iquitos: '/images/destination-tokyo.png',
};

function getImagen(ciudad: string): string {
  return IMAGEN_DESTINO[ciudad] || '/images/airplane-cabin.png';
}

// Agrupa vuelos por fecha para mostrarlos con encabezado de fecha
function agruparPorFecha(vuelos: VueloAPI[]): { fecha: string; vuelos: VueloAPI[] }[] {
  const grupos: Record<string, VueloAPI[]> = {};
  for (const v of vuelos) {
    const fechaKey = v.fechaHoraPartida.split('T')[0];
    if (!grupos[fechaKey]) grupos[fechaKey] = [];
    grupos[fechaKey].push(v);
  }
  return Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, vuelos]) => ({ fecha: vuelos[0].fechaHoraPartida, vuelos }));
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    departure?: string;
    passengers?: string;
    tripType?: string;
    returnDate?: string;
  }>;
}) {
  const params = await searchParams;

  const from = params.from || '';
  const to = params.to || '';
  const departure = params.departure || '';
  const passengers = Math.max(1, parseInt(params.passengers || '1'));
  const tripType = params.tripType || 'oneWay';
  const returnDate = params.returnDate || '';

  let vuelos: VueloAPI[] = [];
  let esFechaAlternativa = false;
  let errorMsg = '';

  try {
    const query = new URLSearchParams();
    if (from) query.set('origen', from);
    if (to) query.set('destino', to);
    if (departure) query.set('fecha', departure);
    query.set('pasajeros', passengers.toString());

    const res = await fetch(`${API_BASE}/api/vuelos/buscar?${query.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);

    const data: ApiResponse = await res.json();
    vuelos = data.vuelos;
    esFechaAlternativa = data.esFechaAlternativa;
  } catch (err) {
    errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    console.error('Error fetching vuelos:', err);
  }

  const grupos = agruparPorFecha(vuelos);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            {from && <span>{from}</span>}
            {from && to && <span>→</span>}
            {to && <span>{to}</span>}
            {departure && !esFechaAlternativa && <span>· {formatFechaCorta(departure)}</span>}
            <span>· {passengers} pasajero{passengers !== 1 ? 's' : ''}</span>
            {tripType === 'roundTrip' && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                Ida y vuelta
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {from && to ? `${from} → ${to}` : 'Vuelos disponibles'}
          </h1>
          <p className="text-muted-foreground">
            {errorMsg
              ? 'Error al cargar vuelos'
              : vuelos.length > 0
              ? `${vuelos.length} vuelo${vuelos.length !== 1 ? 's' : ''} encontrado${vuelos.length !== 1 ? 's' : ''}`
              : 'Sin vuelos disponibles para esta ruta'}
            {vuelos.length > 0 && passengers > 1 && ' · Precios por pasajero'}
          </p>
        </div>

        {/* Error de conexión */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 font-medium">{errorMsg}</p>
            <p className="text-muted-foreground text-sm mt-1">
              Backend esperado en <code className="text-primary">{API_BASE}</code>
            </p>
          </div>
        )}

        {/* Aviso de fecha alternativa */}
        {esFechaAlternativa && vuelos.length > 0 && (
          <div className="mb-8 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-4 items-start">
            <CalendarX className="text-amber-400 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="text-amber-400 font-semibold">
                No hay vuelos disponibles para el {formatFechaCorta(departure)}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Te mostramos los vuelos disponibles en otras fechas para la misma ruta.
                Selecciona el que más te convenga.
              </p>
            </div>
          </div>
        )}

        {/* Sin resultados en ninguna fecha */}
        {!errorMsg && vuelos.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg mb-2">
              No encontramos vuelos de <strong>{from}</strong> a <strong>{to}</strong>.
            </p>
            <p className="text-muted-foreground text-sm mb-6">Intenta con otras ciudades.</p>
            <a href="/booking" className="text-primary underline">Volver a buscar</a>
          </div>
        )}

        {/* Resultados agrupados por fecha */}
        {vuelos.length > 0 && (
          <div className="space-y-10">
            {grupos.map((grupo) => (
              <div key={grupo.fecha}>
                {/* Encabezado de fecha — solo se muestra si hay fechas alternativas (más de 1 grupo) */}
                {(esFechaAlternativa || grupos.length > 1) && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm font-semibold text-foreground capitalize px-2">
                      {formatFechaLarga(grupo.fecha)}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {grupo.vuelos.map((vuelo) => (
                    <FlightCard
                      key={vuelo.id}
                      id={vuelo.id}
                      from={vuelo.origen.codigoIata}
                      to={vuelo.destino.codigoIata}
                      fromCity={vuelo.origen.ciudad}
                      toCity={vuelo.destino.ciudad}
                      airline={`${vuelo.avion} · ${vuelo.codigoVuelo}`}
                      departure={formatHora(vuelo.fechaHoraPartida)}
                      arrival={formatHora(vuelo.fechaHoraLlegadaEstimada)}
                      duration={formatDuracion(vuelo.duracionMinutos)}
                      stops={0}
                      price={vuelo.precio}
                      image={getImagen(vuelo.destino.ciudad)}
                      passengers={passengers}
                      tripType={tripType}
                      returnDate={returnDate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}