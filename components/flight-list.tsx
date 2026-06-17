"use client";

import { useState } from "react";
import type { FlightState, SelectedFlight } from "@/.next/dev/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plane, Search, ArrowUp, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

interface FlightListProps {
  flights: FlightState[];
  selectedFlight: SelectedFlight | null;
  onSelectFlight: (flight: SelectedFlight) => void;
}

export function FlightList({
  flights,
  selectedFlight,
  onSelectFlight,
}: FlightListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFlights = flights
    .filter(
      (f) =>
        f.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.originCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.icao24.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.airline && f.airline.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.destinationInfo?.code && f.destinationInfo.code.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => b.altitude - a.altitude);

  const handleSelectFlight = (flight: FlightState) => {
    const selectedData: SelectedFlight = {
      ...flight,
      aircraftType: flight.aircraftType || "Unknown",
      destination: flight.destinationInfo?.name || "Unknown",
      distance: 0,
    };
    onSelectFlight(selectedData);
  };

  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plane className="w-5 h-5 text-cyan-400" />
          Flights
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {flights.length} active
          </span>
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by flight, airline, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2 pr-1">
          {filteredFlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Plane className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No flights found</p>
            </div>
          ) : (
            filteredFlights.map((flight) => {
              const isSelected = selectedFlight?.icao24 === flight.icao24;
              const isClimbing = flight.verticalRate > 100;
              const isDescending = flight.verticalRate < -100;
              
              return (
                <button
                  key={flight.icao24}
                  onClick={() => handleSelectFlight(flight)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                      : "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {flight.callsign || "N/A"}
                      </span>
                      {isClimbing && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                      {isDescending && <TrendingDown className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-cyan-400 rotate-90" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="text-cyan-400 font-medium">{flight.airline || flight.originCountry}</span>
                    {flight.originInfo && flight.destinationInfo && (
                      <>
                        <span>•</span>
                        <span>{flight.originInfo.code} → {flight.destinationInfo.code}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      {flight.altitude.toLocaleString()} ft
                    </span>
                    <span>{flight.velocity} kts</span>
                    {flight.aircraftType && (
                      <span className="truncate text-foreground/60">{flight.aircraftType.split(' ')[0]}</span>
                    )}
                  </div>
                  
                  {/* Altitude progress bar */}
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isClimbing 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                            : isDescending 
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                              : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                        }`}
                        style={{ width: `${Math.min((flight.altitude / 45000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
