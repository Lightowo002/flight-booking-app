"use client";

import type { FlightState } from "@/.next/dev/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Globe, ArrowUp, Gauge, TrendingUp, TrendingDown } from "lucide-react";

interface FlightStatsProps {
  flights: FlightState[];
  lastUpdate: Date | null;
}

export function FlightStats({ flights, lastUpdate }: FlightStatsProps) {
  const inFlight = flights.filter((f) => !f.onGround).length;
  const climbing = flights.filter((f) => f.verticalRate > 100).length;
  const descending = flights.filter((f) => f.verticalRate < -100).length;
  const cruising = inFlight - climbing - descending;
  
  const avgAltitude = flights.length > 0
    ? Math.round(
        flights.filter((f) => !f.onGround).reduce((sum, f) => sum + f.altitude, 0) /
          Math.max(inFlight, 1)
      )
    : 0;
  const avgSpeed = flights.length > 0
    ? Math.round(
        flights.filter((f) => !f.onGround).reduce((sum, f) => sum + f.velocity, 0) /
          Math.max(inFlight, 1)
      )
    : 0;
  
  const maxAltitude = flights.length > 0 ? Math.max(...flights.map(f => f.altitude)) : 0;
  const highestFlight = flights.find(f => f.altitude === maxAltitude);

  const airlines = new Set(flights.map((f) => f.airline).filter(Boolean)).size;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Live Statistics
          </CardTitle>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Active Flights</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{flights.length}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Airlines</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{airlines}</p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Avg Altitude</span>
            </div>
            <p className="text-xl font-bold text-foreground">{avgAltitude.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">feet</p>
          </div>
          
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Avg Speed</span>
            </div>
            <p className="text-xl font-bold text-foreground">{avgSpeed}</p>
            <p className="text-xs text-muted-foreground">knots</p>
          </div>
        </div>

        {/* Flight phases */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Flight Phases</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-foreground">{climbing}</span>
              <span className="text-xs text-muted-foreground">climbing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-cyan-400 rounded-full" />
              <span className="text-sm font-medium text-foreground">{cruising}</span>
              <span className="text-xs text-muted-foreground">cruising</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-foreground">{descending}</span>
              <span className="text-xs text-muted-foreground">descending</span>
            </div>
          </div>
        </div>

        {/* Highest flight */}
        {highestFlight && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
            <p className="text-xs text-muted-foreground mb-1">Highest Flight</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">{highestFlight.callsign}</p>
                <p className="text-xs text-cyan-400">{highestFlight.airline}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{maxAltitude.toLocaleString()} ft</p>
                <p className="text-xs text-muted-foreground">{highestFlight.velocity} kts</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
