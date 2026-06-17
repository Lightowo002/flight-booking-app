// app/api/flights/route.ts

import { NextResponse } from "next/server";
import { nearestAirport, distanceKm } from "@/lib/airports";

const OPENSKY_URL =
  "https://opensky-network.org/api/states/all" +
  "?lamin=-55.0&lomin=-85.0&lamax=35.0&lomax=-30.0";

const IDX = {
  icao24:       0,
  callsign:     1,
  originCountry:2,
  longitude:    5,
  latitude:     6,
  baroAltitude: 7,
  onGround:     8,
  velocity:     9,
  trueTrack:    10,
  verticalRate: 11,
} as const;

// Cache en memoria — respeta el rate limit de OpenSky (10 req/min sin cuenta)
let cache: { payload: ReturnType<typeof buildPayload>; timestamp: number } | null = null;
const CACHE_TTL_MS = 15_000;

// ---------------------------------------------------------------------------
// buildPayload — construye la respuesta con la MISMA forma que el simulador:
//   { time, states, extendedStates, simulated }
// así el resto del código (FlightMap, hooks, etc.) no necesita ningún cambio.
// ---------------------------------------------------------------------------
function buildPayload(rawStates: unknown[][], time: number) {
  // states: mantenemos los arrays originales de OpenSky tal cual,
  // igual que generateSimulatedFlights() devuelve sus arrays.
  const states: unknown[][] = [];
  const extendedStates: {
    state: unknown[];
    routeInfo: {
      airline: string;
      aircraftType: string;
      origin: ReturnType<typeof nearestAirport>;
      destination: ReturnType<typeof nearestAirport>;
    } | null;
  }[] = [];

  for (const s of rawStates) {
    const lat      = s[IDX.latitude]  as number | null;
    const lng      = s[IDX.longitude] as number | null;
    const onGround = s[IDX.onGround]  as boolean;
    const icao24   = s[IDX.icao24]    as string;

    if (lat == null || lng == null || onGround) continue;

    // Enriquecimiento con aeropuertos (lógica del script Python)
    const destination = nearestAirport(lat, lng);
    const origin      = nearestAirport(lat, lng, destination?.icao);

    states.push(s);

    extendedStates.push({
      state: s,
      routeInfo: {
        // 'airline' lo inferimos del callsign (primeras 3 letras = código IATA aerolínea)
        airline:      ((s[IDX.callsign] as string) ?? "").trim().slice(0, 3) || "???",
        aircraftType: "Unknown", // OpenSky no lo provee; requiere BD externa
        origin,
        destination,
      },
    });
  }

  return { time, states, extendedStates, simulated: false };
}

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.payload, { headers: { "X-Cache": "HIT" } });
  }

  try {
    const res = await fetch(OPENSKY_URL, {
      next: { revalidate: 15 },
      headers: { "User-Agent": "FlightTracker/1.0" },
    });

    if (res.status === 429) {
      if (cache) return NextResponse.json(cache.payload, { headers: { "X-Cache": "STALE" } });
      return NextResponse.json({ error: "Rate limit alcanzado" }, { status: 429 });
    }

    if (!res.ok) throw new Error(`OpenSky respondió ${res.status}`);

    const raw = await res.json();

    if (!raw?.states) {
      // Sin vuelos activos — devolvemos la misma forma vacía
      return NextResponse.json({ time: raw?.time ?? Date.now(), states: [], extendedStates: [], simulated: false });
    }

    const payload = buildPayload(raw.states as unknown[][], raw.time as number);
    cache = { payload, timestamp: Date.now() };

    return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } });
  } catch (err) {
    console.error("[flights/route]", err);
    if (cache) return NextResponse.json(cache.payload, { headers: { "X-Cache": "STALE" } });
    return NextResponse.json({ error: "Error al contactar OpenSky" }, { status: 500 });
  }
}