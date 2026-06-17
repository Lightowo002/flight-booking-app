"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import type { FlightState, SelectedFlight, FlightAPIResponse } from "@/types/flight";
import { Header } from "@/components/header";
import { FlightDetails } from "@/components/flight-details";
import { FlightStats } from "@/components/flight-stats";
import { FlightList } from "@/components/flight-list";

// Dynamically import the map to avoid SSR issues with Leaflet
const FlightMap = dynamic(
  () => import("@/components/flight-map").then((mod) => mod.FlightMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-card rounded-xl border border-border" style={{ minHeight: "500px" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function parseFlightData(data: FlightAPIResponse): FlightState[] {
  if (!data.extendedStates) return [];

  const flights: FlightState[] = [];

  for (const item of data.extendedStates) {
    const state = item.state;
    const routeInfo = item.routeInfo;

    if (!state[5] || !state[6]) continue;

    flights.push({
      icao24: (state[0] as string) || "",
      callsign: ((state[1] as string) || "").trim(),
      originCountry: (state[2] as string) || "",
      longitude: state[5] as number,
      latitude: state[6] as number,
      altitude: Math.round(((state[7] as number) || 0) * 3.28084),
      velocity: Math.round(((state[9] as number) || 0) * 1.94384),
      heading: (state[10] as number) || 0,
      verticalRate: Math.round(((state[11] as number) || 0) * 196.85),
      onGround: (state[8] as boolean) || false,
      aircraftType: routeInfo?.aircraftType,
      airline: routeInfo?.airline,
      originInfo: routeInfo?.origin,
      destinationInfo: routeInfo?.destination,
    });
  }

  return flights;
}

export function FlightTracker() {
  const [selectedFlight, setSelectedFlight] = useState<SelectedFlight | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { data, error, isLoading, mutate } = useSWR<FlightAPIResponse>(
    "/api/flights",
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  );

  const flights: FlightState[] = data ? parseFlightData(data) : [];

  // Update last update time and selected flight position
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
      
      if (selectedFlight) {
        const updatedFlight = flights.find(f => f.icao24 === selectedFlight.icao24);
        if (updatedFlight) {
          setSelectedFlight({
            ...updatedFlight,
            aircraftType: updatedFlight.aircraftType || selectedFlight.aircraftType,
            destination: updatedFlight.destinationInfo?.name || selectedFlight.destination,
            distance: selectedFlight.distance,
          });
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSelectFlight = useCallback((flight: SelectedFlight | null) => {
    setSelectedFlight(flight);
  }, []);

  const handleRefresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isLoading={isLoading}
        onRefresh={handleRefresh}
        flightCount={flights.length}
      />

      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Flight List */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <FlightList
              flights={flights}
              selectedFlight={selectedFlight}
              onSelectFlight={handleSelectFlight}
            />
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2 h-full min-h-[500px] relative">
            <FlightMap
              flights={flights}
              selectedFlight={selectedFlight}
              onSelectFlight={handleSelectFlight}
            />

            {/* Simulation badge */}
            {data?.simulated && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-medium flex items-center gap-2 z-[1000]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                Simulation Mode
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl z-[1000]">
                <div className="text-center p-6">
                  <p className="text-destructive mb-2">Failed to load flight data</p>
                  <button
                    onClick={handleRefresh}
                    className="text-cyan-400 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Details & Stats */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {selectedFlight ? (
              <FlightDetails
                flight={selectedFlight}
                onClose={() => setSelectedFlight(null)}
              />
            ) : (
              <FlightStats flights={flights} lastUpdate={lastUpdate} />
            )}

            {selectedFlight && (
              <FlightStats flights={flights} lastUpdate={lastUpdate} />
            )}

            {/* Legend */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Map Legend</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#06b6d4">
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
                  </svg>
                  <span className="text-muted-foreground">Aircraft in flight</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#22d3ee">
                    <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
                  </svg>
                  <span className="text-muted-foreground">Selected aircraft</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-0.5 bg-cyan-400" />
                  <span className="text-muted-foreground">Traveled route</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-0.5 bg-cyan-400/40 border-t border-dashed border-cyan-400" />
                  <span className="text-muted-foreground">Remaining route</span>
                </div>
              </div>
            </div>

            {/* Data Source */}
            <div className="p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground/80">Simulated Flight Data</p>
              <p className="mt-1">20 realistic routes with live animation</p>
              <p className="mt-0.5">Updates every 3 seconds</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
