"use client";

import type { SelectedFlight } from "@/.next/dev/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plane,
  Navigation,
  Gauge,
  ArrowUp,
  MapPin,
  Clock,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  PlaneTakeoff,
  PlaneLanding,
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

  // Calculate ETA based on remaining distance
  const calculateETA = () => {
    if (!flight.destinationInfo || !flight.velocity) return "Calculating...";
    
    const R = 6371;
    const dLat = ((flight.destinationInfo.lat - flight.latitude) * Math.PI) / 180;
    const dLng = ((flight.destinationInfo.lng - flight.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((flight.latitude * Math.PI) / 180) *
        Math.cos((flight.destinationInfo.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    
    const speedKmh = flight.velocity * 1.852;
    const hoursRemaining = distanceKm / speedKmh;
    
    if (hoursRemaining < 0.0833) return "< 5 min";
    if (hoursRemaining < 1) return `${Math.round(hoursRemaining * 60)} min`;
    
    const hours = Math.floor(hoursRemaining);
    const minutes = Math.round((hoursRemaining - hours) * 60);
    return `${hours}h ${minutes}m`;
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
        {/* Aircraft Type */}
        {flight.aircraftType && (
          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Aircraft Type</p>
            <p className="font-semibold text-foreground">{flight.aircraftType}</p>
            <p className="text-xs text-muted-foreground mt-1">ICAO: {flight.icao24.toUpperCase()}</p>
          </div>
        )}

        {/* Route Information */}
        {flight.originInfo && flight.destinationInfo && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-rose-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <PlaneTakeoff className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-muted-foreground">Origin</span>
                </div>
                <p className="font-bold text-lg text-foreground">{flight.originInfo.code}</p>
                <p className="text-xs text-muted-foreground truncate">{flight.originInfo.name}</p>
              </div>
              
              <div className="flex-shrink-0 px-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-rose-400" />
                  <Plane className="w-4 h-4 text-foreground -rotate-90" />
                  <div className="w-8 h-0.5 bg-gradient-to-r from-rose-400/50 to-rose-400 border-t border-dashed border-rose-400/50" />
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">Destination</span>
                  <PlaneLanding className="w-4 h-4 text-rose-400" />
                </div>
                <p className="font-bold text-lg text-foreground">{flight.destinationInfo.code}</p>
                <p className="text-xs text-muted-foreground truncate">{flight.destinationInfo.name}</p>
              </div>
            </div>
          </div>
        )}

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

        {/* ETA */}
        {flight.destinationInfo && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-muted-foreground">Estimated Time to Arrival</span>
              </div>
              <p className="font-bold text-lg text-cyan-400">{calculateETA()}</p>
            </div>
          </div>
        )}

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
