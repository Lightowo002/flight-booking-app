// hooks/useFlights.ts
// Llama a /api/flights cada 15 segundos y actualiza el estado automáticamente.

import { useState, useEffect, useCallback } from "react";
import type { FlightState, SelectedFlight, FlightAPIResponse } from "@/types/flight";

interface UseFlightsResult {
  flights: FlightState[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

const POLL_INTERVAL_MS = 15_000; // 15 segundos — respeta el rate limit de OpenSky

export function useFlights(): UseFlightsResult {
  const [flights, setFlights]           = useState<FlightState[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);

  const fetchFlights = useCallback(async () => {
    try {
      const res = await fetch("/api/flights");

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data: FlightState[] = await res.json();
      setFlights(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights(); // carga inicial

    const interval = setInterval(fetchFlights, POLL_INTERVAL_MS);
    return () => clearInterval(interval); // limpia al desmontar
  }, [fetchFlights]);

  return { flights, loading, error, lastUpdated, refresh: fetchFlights };
}