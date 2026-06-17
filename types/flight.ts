export interface FlightState {
  icao24: string;
  callsign: string;
  originCountry: string;
  longitude: number;
  latitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  verticalRate: number;
  onGround: boolean;
  // Extended info from simulation
  aircraftType?: string;
  airline?: string;
  originInfo?: {
    name: string;
    code: string;
    lat: number;
    lng: number;
  };
  destinationInfo?: {
    name: string;
    code: string;
    lat: number;
    lng: number;
  };
}

export interface SelectedFlight extends FlightState {
  estimatedArrival?: string;
  departure?: string;
  destination?: string;
  aircraftType?: string;
  distance?: number;
}

export interface FlightAPIResponse {
  time: number;
  states: (string | number | boolean | null)[][] | null;
  extendedStates?: {
    state: (string | number | boolean | null)[];
    routeInfo: {
      airline: string;
      aircraftType: string;
      origin: { name: string; code: string; lat: number; lng: number };
      destination: { name: string; code: string; lat: number; lng: number };
    } | null;
  }[];
  simulated?: boolean;
}
