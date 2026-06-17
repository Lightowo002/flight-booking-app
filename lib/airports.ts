// lib/airports.ts
// Equivalente al AIRPORTS_DB del script Python

export interface AirportInfo {
  code: string;   // IATA
  name: string;
  lat: number;
  lng: number;
}

export const AIRPORTS_DB: Record<string, AirportInfo> = {
  SPJC: { code: "LIM", name: "Lima - Jorge Chávez",        lat: -12.0219, lng: -77.1143 },
  SPZO: { code: "CUZ", name: "Cusco - Velasco Astete",      lat: -13.5357, lng: -71.9388 },
  SPTU: { code: "TPP", name: "Tarapoto - Cadete FAP",       lat:  -6.5088, lng: -76.3732 },
  SPQT: { code: "IQT", name: "Iquitos - Coronel FAP",       lat:  -3.7847, lng: -73.3088 },
  SPHO: { code: "AYP", name: "Ayacucho - Coronel FAP",      lat: -13.1548, lng: -74.2044 },
  SPCL: { code: "PCL", name: "Pucallpa - David Figueroa",   lat:  -8.3779, lng: -74.5743 },
  SPTN: { code: "TCQ", name: "Tacna - Crnl. FAP Tumi Curi", lat: -18.0533, lng: -70.2758 },
  SPYL: { code: "TYL", name: "Talara - Capitan FAP",        lat:  -4.5766, lng: -81.2541 },
  SKBO: { code: "BOG", name: "Bogotá - El Dorado",          lat:   4.7016, lng: -74.1469 },
  SEQM: { code: "UIO", name: "Quito - Mariscal Sucre",      lat:  -0.1292, lng: -78.3575 },
  SCEL: { code: "SCL", name: "Santiago - Arturo Merino",    lat: -33.3930, lng: -70.7858 },
  SAEZ: { code: "EZE", name: "Buenos Aires - Ezeiza",       lat: -34.8222, lng: -58.5358 },
  SBGR: { code: "GRU", name: "São Paulo - Guarulhos",       lat: -23.4356, lng: -46.4731 },
  SLLP: { code: "LPB", name: "La Paz - El Alto",            lat: -16.5133, lng: -68.1923 },
  MMMX: { code: "MEX", name: "Ciudad de México",            lat:  19.4363, lng: -99.0721 },
  KMIA: { code: "MIA", name: "Miami International",         lat:  25.7959, lng: -80.2870 },
  KJFK: { code: "JFK", name: "New York - JFK",              lat:  40.6413, lng: -73.7781 },
  LEMD: { code: "MAD", name: "Madrid - Barajas",            lat:  40.4719, lng:  -3.5626 },
  LFPG: { code: "CDG", name: "París - Charles de Gaulle",   lat:  49.0097, lng:   2.5479 },
  EGLL: { code: "LHR", name: "Londres - Heathrow",          lat:  51.4775, lng:  -0.4614 },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function nearestAirport(
  lat: number,
  lng: number,
  exclude?: string
): { icao: string; info: AirportInfo; distKm: number } | null {
  let best: { icao: string; info: AirportInfo; distKm: number } | null = null;

  for (const [icao, info] of Object.entries(AIRPORTS_DB)) {
    if (icao === exclude) continue;
    const dist = haversineKm(lat, lng, info.lat, info.lng);
    if (!best || dist < best.distKm) {
      best = { icao, info, distKm: dist };
    }
  }

  return best;
}

export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  return haversineKm(lat1, lng1, lat2, lng2);
}