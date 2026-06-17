// Simulated flight data with realistic routes
export interface SimulatedRoute {
  id: string;
  callsign: string;
  airline: string;
  aircraftType: string;
  origin: { name: string; code: string; lat: number; lng: number };
  destination: { name: string; code: string; lat: number; lng: number };
  cruiseAltitude: number; // in feet
  cruiseSpeed: number; // in knots
  departureTime: number; // timestamp offset
}

const ROUTES: SimulatedRoute[] = [
  {
    id: "1",
    callsign: "IBE3170",
    airline: "Iberia",
    aircraftType: "Airbus A320",
    origin: { name: "Madrid Barajas", code: "MAD", lat: 40.4719, lng: -3.5626 },
    destination: { name: "Barcelona El Prat", code: "BCN", lat: 41.2974, lng: 2.0833 },
    cruiseAltitude: 35000,
    cruiseSpeed: 450,
    departureTime: 0,
  },
  {
    id: "2",
    callsign: "VLG8012",
    airline: "Vueling",
    aircraftType: "Airbus A321",
    origin: { name: "Barcelona El Prat", code: "BCN", lat: 41.2974, lng: 2.0833 },
    destination: { name: "Paris CDG", code: "CDG", lat: 49.0097, lng: 2.5479 },
    cruiseAltitude: 38000,
    cruiseSpeed: 480,
    departureTime: 300000,
  },
  {
    id: "3",
    callsign: "AFR1234",
    airline: "Air France",
    aircraftType: "Boeing 777-300ER",
    origin: { name: "Paris CDG", code: "CDG", lat: 49.0097, lng: 2.5479 },
    destination: { name: "New York JFK", code: "JFK", lat: 40.6413, lng: -73.7781 },
    cruiseAltitude: 41000,
    cruiseSpeed: 520,
    departureTime: 600000,
  },
  {
    id: "4",
    callsign: "BAW456",
    airline: "British Airways",
    aircraftType: "Airbus A380",
    origin: { name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543 },
    destination: { name: "Dubai DXB", code: "DXB", lat: 25.2532, lng: 55.3657 },
    cruiseAltitude: 40000,
    cruiseSpeed: 500,
    departureTime: 200000,
  },
  {
    id: "5",
    callsign: "DLH789",
    airline: "Lufthansa",
    aircraftType: "Boeing 747-8",
    origin: { name: "Frankfurt FRA", code: "FRA", lat: 50.0379, lng: 8.5622 },
    destination: { name: "Tokyo Narita", code: "NRT", lat: 35.7720, lng: 140.3929 },
    cruiseAltitude: 42000,
    cruiseSpeed: 530,
    departureTime: 400000,
  },
  {
    id: "6",
    callsign: "UAE202",
    airline: "Emirates",
    aircraftType: "Airbus A380",
    origin: { name: "Dubai DXB", code: "DXB", lat: 25.2532, lng: 55.3657 },
    destination: { name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543 },
    cruiseAltitude: 39000,
    cruiseSpeed: 510,
    departureTime: 100000,
  },
  {
    id: "7",
    callsign: "RYR2345",
    airline: "Ryanair",
    aircraftType: "Boeing 737 MAX 8",
    origin: { name: "Dublin DUB", code: "DUB", lat: 53.4264, lng: -6.2499 },
    destination: { name: "Rome Fiumicino", code: "FCO", lat: 41.8003, lng: 12.2389 },
    cruiseAltitude: 37000,
    cruiseSpeed: 460,
    departureTime: 500000,
  },
  {
    id: "8",
    callsign: "KLM567",
    airline: "KLM",
    aircraftType: "Boeing 787-9",
    origin: { name: "Amsterdam AMS", code: "AMS", lat: 52.3086, lng: 4.7639 },
    destination: { name: "Singapore Changi", code: "SIN", lat: 1.3644, lng: 103.9915 },
    cruiseAltitude: 41000,
    cruiseSpeed: 540,
    departureTime: 700000,
  },
  {
    id: "9",
    callsign: "TAP890",
    airline: "TAP Portugal",
    aircraftType: "Airbus A330-900",
    origin: { name: "Lisbon LIS", code: "LIS", lat: 38.7742, lng: -9.1342 },
    destination: { name: "São Paulo GRU", code: "GRU", lat: -23.4356, lng: -46.4731 },
    cruiseAltitude: 40000,
    cruiseSpeed: 490,
    departureTime: 800000,
  },
  {
    id: "10",
    callsign: "SAS321",
    airline: "SAS",
    aircraftType: "Airbus A350-900",
    origin: { name: "Copenhagen CPH", code: "CPH", lat: 55.6180, lng: 12.6508 },
    destination: { name: "Los Angeles LAX", code: "LAX", lat: 33.9416, lng: -118.4085 },
    cruiseAltitude: 43000,
    cruiseSpeed: 550,
    departureTime: 150000,
  },
  {
    id: "11",
    callsign: "AZA111",
    airline: "ITA Airways",
    aircraftType: "Airbus A320neo",
    origin: { name: "Rome Fiumicino", code: "FCO", lat: 41.8003, lng: 12.2389 },
    destination: { name: "Milan Malpensa", code: "MXP", lat: 45.6306, lng: 8.7231 },
    cruiseAltitude: 32000,
    cruiseSpeed: 420,
    departureTime: 250000,
  },
  {
    id: "12",
    callsign: "SWR222",
    airline: "Swiss",
    aircraftType: "Airbus A220-300",
    origin: { name: "Zurich ZRH", code: "ZRH", lat: 47.4647, lng: 8.5492 },
    destination: { name: "Vienna VIE", code: "VIE", lat: 48.1103, lng: 16.5697 },
    cruiseAltitude: 34000,
    cruiseSpeed: 440,
    departureTime: 350000,
  },
  {
    id: "13",
    callsign: "THY333",
    airline: "Turkish Airlines",
    aircraftType: "Boeing 787-9",
    origin: { name: "Istanbul IST", code: "IST", lat: 41.2753, lng: 28.7519 },
    destination: { name: "New York JFK", code: "JFK", lat: 40.6413, lng: -73.7781 },
    cruiseAltitude: 41000,
    cruiseSpeed: 520,
    departureTime: 450000,
  },
  {
    id: "14",
    callsign: "QTR444",
    airline: "Qatar Airways",
    aircraftType: "Airbus A350-1000",
    origin: { name: "Doha DOH", code: "DOH", lat: 25.2731, lng: 51.6081 },
    destination: { name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543 },
    cruiseAltitude: 40000,
    cruiseSpeed: 510,
    departureTime: 550000,
  },
  {
    id: "15",
    callsign: "AAL555",
    airline: "American Airlines",
    aircraftType: "Boeing 777-300ER",
    origin: { name: "Chicago ORD", code: "ORD", lat: 41.9742, lng: -87.9073 },
    destination: { name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543 },
    cruiseAltitude: 39000,
    cruiseSpeed: 500,
    departureTime: 650000,
  },
  {
    id: "16",
    callsign: "EZY666",
    airline: "easyJet",
    aircraftType: "Airbus A320neo",
    origin: { name: "London Gatwick", code: "LGW", lat: 51.1537, lng: -0.1821 },
    destination: { name: "Nice NCE", code: "NCE", lat: 43.6584, lng: 7.2159 },
    cruiseAltitude: 36000,
    cruiseSpeed: 450,
    departureTime: 50000,
  },
  {
    id: "17",
    callsign: "FIN777",
    airline: "Finnair",
    aircraftType: "Airbus A350-900",
    origin: { name: "Helsinki HEL", code: "HEL", lat: 60.3172, lng: 24.9633 },
    destination: { name: "Tokyo Haneda", code: "HND", lat: 35.5494, lng: 139.7798 },
    cruiseAltitude: 42000,
    cruiseSpeed: 540,
    departureTime: 750000,
  },
  {
    id: "18",
    callsign: "AUA888",
    airline: "Austrian",
    aircraftType: "Embraer E195-E2",
    origin: { name: "Vienna VIE", code: "VIE", lat: 48.1103, lng: 16.5697 },
    destination: { name: "Athens ATH", code: "ATH", lat: 37.9364, lng: 23.9445 },
    cruiseAltitude: 33000,
    cruiseSpeed: 430,
    departureTime: 850000,
  },
  {
    id: "19",
    callsign: "LOT999",
    airline: "LOT Polish",
    aircraftType: "Boeing 787-8",
    origin: { name: "Warsaw WAW", code: "WAW", lat: 52.1657, lng: 20.9671 },
    destination: { name: "Seoul ICN", code: "ICN", lat: 37.4691, lng: 126.4505 },
    cruiseAltitude: 41000,
    cruiseSpeed: 530,
    departureTime: 950000,
  },
  {
    id: "20",
    callsign: "NOR123",
    airline: "Norwegian",
    aircraftType: "Boeing 737 MAX 8",
    origin: { name: "Oslo OSL", code: "OSL", lat: 60.1939, lng: 11.1004 },
    destination: { name: "Malaga AGP", code: "AGP", lat: 36.6749, lng: -4.4991 },
    cruiseAltitude: 38000,
    cruiseSpeed: 470,
    departureTime: 1050000,
  },
];

// Calculate the great circle distance between two points
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate bearing between two points
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Interpolate position along great circle route
function interpolatePosition(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  fraction: number
): { lat: number; lng: number } {
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lng1Rad = (lng1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lng2Rad = (lng2 * Math.PI) / 180;

  const d = haversineDistance(lat1, lng1, lat2, lng2) / 6371;
  
  if (d < 0.00001) {
    return { lat: lat1, lng: lng1 };
  }

  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);

  const x = a * Math.cos(lat1Rad) * Math.cos(lng1Rad) + b * Math.cos(lat2Rad) * Math.cos(lng2Rad);
  const y = a * Math.cos(lat1Rad) * Math.sin(lng1Rad) + b * Math.cos(lat2Rad) * Math.sin(lng2Rad);
  const z = a * Math.sin(lat1Rad) + b * Math.sin(lat2Rad);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lng = Math.atan2(y, x);

  return {
    lat: (lat * 180) / Math.PI,
    lng: (lng * 180) / Math.PI,
  };
}

// Get altitude profile (climb, cruise, descent)
function getAltitudeForProgress(cruiseAltitude: number, progress: number): number {
  // Climb phase (0-15%)
  if (progress < 0.15) {
    return Math.round((progress / 0.15) * cruiseAltitude);
  }
  // Descent phase (85-100%)
  if (progress > 0.85) {
    return Math.round(((1 - progress) / 0.15) * cruiseAltitude);
  }
  // Cruise phase
  return cruiseAltitude;
}

// Get vertical rate based on phase
function getVerticalRate(cruiseAltitude: number, progress: number): number {
  if (progress < 0.15) {
    return Math.round(1500 + Math.random() * 500); // Climbing
  }
  if (progress > 0.85) {
    return -Math.round(1200 + Math.random() * 400); // Descending
  }
  return Math.round((Math.random() - 0.5) * 100); // Cruising with minor variations
}

export function generateSimulatedFlights(): {
  time: number;
  states: (string | number | boolean | null)[][];
  flightInfo: Map<string, SimulatedRoute>;
} {
  const now = Date.now();
  const cycleLength = 3600000; // 1 hour cycle for short routes, longer routes loop back
  const states: (string | number | boolean | null)[][] = [];
  const flightInfo = new Map<string, SimulatedRoute>();

  ROUTES.forEach((route) => {
    const totalDistance = haversineDistance(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng
    );
    
    // Flight duration in ms (distance in km / speed in km/h * 3600000)
    const flightDuration = (totalDistance / (route.cruiseSpeed * 1.852)) * 3600000;
    
    // Calculate progress with looping
    const timeInCycle = (now + route.departureTime) % (flightDuration + 300000); // Add 5 min turnaround
    let progress = Math.min(timeInCycle / flightDuration, 1);
    
    // If in turnaround, skip this flight temporarily
    if (timeInCycle > flightDuration) {
      return;
    }

    const position = interpolatePosition(
      route.origin.lat,
      route.origin.lng,
      route.destination.lat,
      route.destination.lng,
      progress
    );

    const heading = calculateBearing(
      position.lat,
      position.lng,
      route.destination.lat,
      route.destination.lng
    );

    const altitude = getAltitudeForProgress(route.cruiseAltitude, progress);
    const verticalRate = getVerticalRate(route.cruiseAltitude, progress);
    
    // Add some realistic speed variation
    const speedVariation = 0.95 + Math.random() * 0.1;
    const currentSpeed = route.cruiseSpeed * speedVariation * (progress < 0.15 || progress > 0.85 ? 0.8 : 1);

    // OpenSky format: [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
    const state = [
      route.id.padStart(6, "0"), // icao24
      route.callsign, // callsign
      route.airline, // Using airline as origin_country for display
      now / 1000, // time_position
      now / 1000, // last_contact
      position.lng, // longitude
      position.lat, // latitude
      altitude * 0.3048, // baro_altitude in meters
      false, // on_ground
      currentSpeed * 0.514444, // velocity in m/s
      heading, // true_track
      verticalRate * 0.00508, // vertical_rate in m/s
      null, // sensors
      altitude * 0.3048, // geo_altitude
      "7000", // squawk
      false, // spi
      0, // position_source
    ];

    states.push(state);
    flightInfo.set(route.id.padStart(6, "0"), route);
  });

  return {
    time: now / 1000,
    states,
    flightInfo,
  };
}

export function getRouteInfo(icao24: string): SimulatedRoute | undefined {
  const route = ROUTES.find((r) => r.id.padStart(6, "0") === icao24);
  return route;
}

export { ROUTES };
