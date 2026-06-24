"use client";

import type { SelectedFlight } from "@/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plane,
  Navigation,
  Gauge,
  ArrowUp,
  MapPin,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlightDetailsProps {
  flight: SelectedFlight;
  onClose: () => void;
}

export function FlightDetails({ flight, onClose }: FlightDetailsProps) {
  const getVerticalIcon = () => {
    if (flight.verticalRate > 100) return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (flight.verticalRate < -100) return <TrendingDown className="w-4 h-4 text-rose-400" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getVerticalText = () => {
    if (flight.verticalRate > 100) return "Climbing";
    if (flight.verticalRate < -100) return "Descending";
    return "Cruising";
  };

  const getPhaseColor = () => {
    if (flight.verticalRate > 100) return "text-emerald-400";
    if (flight.verticalRate < -100) return "text-amber-400";
    return "text-cyan-400";
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-cyan-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Plane className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {flight.callsign}
              </CardTitle>
              <p className="text-sm text-cyan-400 font-medium">
                {flight.airline || flight.originCountry}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Flight Data Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Altitude */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Altitude</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {flight.altitude.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground ml-1">ft</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              {getVerticalIcon()}
              <span className={`text-xs font-medium ${getPhaseColor()}`}>
                {getVerticalText()}
              </span>
              <span className="text-xs text-muted-foreground">
                {flight.verticalRate !== 0 && `(${flight.verticalRate > 0 ? '+' : ''}${flight.verticalRate} ft/min)`}
              </span>
            </div>
          </div>

          {/* Speed */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Ground Speed</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {flight.velocity}
              <span className="text-sm font-normal text-muted-foreground ml-1">kts</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {Math.round(flight.velocity * 1.852)} km/h · {Math.round(flight.velocity * 1.15078)} mph
            </p>
          </div>

          {/* Heading */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" style={{ transform: `rotate(${flight.heading}deg)` }} />
              <span className="text-xs text-muted-foreground">Heading</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {Math.round(flight.heading)}°
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {getCardinalDirection(flight.heading)}
            </p>
          </div>

          {/* Position */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground">Position</span>
            </div>
            <p className="text-sm font-medium text-foreground">
              {flight.latitude.toFixed(4)}° {flight.latitude >= 0 ? 'N' : 'S'}
            </p>
            <p className="text-sm font-medium text-foreground">
              {flight.longitude.toFixed(4)}° {flight.longitude >= 0 ? 'E' : 'W'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <span className="text-sm text-muted-foreground">Flight Status</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${flight.onGround ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${flight.onGround ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            </span>
            <span className="text-sm font-medium text-foreground">
              {flight.onGround ? "On Ground" : "In Flight"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getCardinalDirection(heading: number): string {
  const directions = [
    "North", "NNE", "Northeast", "ENE",
    "East", "ESE", "Southeast", "SSE",
    "South", "SSW", "Southwest", "WSW",
    "West", "WNW", "Northwest", "NNW",
  ];
  const index = Math.round(heading / 22.5) % 16;
  return directions[index];
}