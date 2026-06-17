"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FlightState, SelectedFlight, FlightAPIResponse } from "@/types/flight";

interface FlightMapProps {
  flights: FlightState[];
  selectedFlight: SelectedFlight | null;
  onSelectFlight: (flight: SelectedFlight | null) => void;
}

const createAircraftIcon = (heading: number, isSelected: boolean) => {
  const color = isSelected ? "#22d3ee" : "#06b6d4";
  const size = isSelected ? 32 : 24;
  
  return L.divIcon({
    className: "aircraft-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        transform: rotate(${heading}deg);
        filter: drop-shadow(0 0 ${isSelected ? '8px' : '4px'} ${isSelected ? 'rgba(34, 211, 238, 0.6)' : 'rgba(6, 182, 212, 0.4)'});
      ">
        <svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
          <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export function FlightMap({
  flights,
  selectedFlight,
  onSelectFlight,
}: FlightMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const pathLayerRef = useRef<L.LayerGroup | null>(null);
  const isInitializedRef = useRef(false);
  const onSelectFlightRef = useRef(onSelectFlight);

  // Keep callback ref updated
  useEffect(() => {
    onSelectFlightRef.current = onSelectFlight;
  }, [onSelectFlight]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const map = L.map(mapContainerRef.current, {
      center: [40.4168, -3.7038], // Madrid as center
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Create layer group for paths
    pathLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      pathLayerRef.current = null;
      isInitializedRef.current = false;
      markersRef.current.clear();
    };
  }, []);

  // Update markers when flights change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentMarkers = markersRef.current;
    const flightIds = new Set(flights.map((f) => f.icao24));

    // Remove old markers
    currentMarkers.forEach((marker, id) => {
      if (!flightIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    flights.forEach((flight) => {
      const isSelected = selectedFlight?.icao24 === flight.icao24;
      const existingMarker = currentMarkers.get(flight.icao24);

      if (existingMarker) {
        existingMarker.setLatLng([flight.latitude, flight.longitude]);
        existingMarker.setIcon(createAircraftIcon(flight.heading, isSelected));
      } else {
        const marker = L.marker([flight.latitude, flight.longitude], {
          icon: createAircraftIcon(flight.heading, isSelected),
        });

        marker.on("click", () => {
          onSelectFlightRef.current({
            ...flight,
            aircraftType: flight.aircraftType || "Unknown",
            destination: flight.destinationInfo?.name || "Unknown",
            distance: 0,
          });
        });

        marker.addTo(map);
        currentMarkers.set(flight.icao24, marker);
      }
    });
  }, [flights, selectedFlight?.icao24]);

  // Draw flight path for selected flight
  useEffect(() => {
    const pathLayer = pathLayerRef.current;
    if (!pathLayer) return;

    // Clear previous paths
    pathLayer.clearLayers();

    if (!selectedFlight) return;

    // Draw route if we have origin/destination
    if (selectedFlight.originInfo && selectedFlight.destinationInfo) {
      // Origin marker
      L.circleMarker(
        [selectedFlight.originInfo.lat, selectedFlight.originInfo.lng],
        {
          radius: 6,
          fillColor: "#22d3ee",
          fillOpacity: 0.9,
          color: "#fff",
          weight: 2,
        }
      ).bindTooltip(selectedFlight.originInfo.code, { 
        permanent: false,
        className: "flight-tooltip"
      }).addTo(pathLayer);

      // Destination marker
      L.circleMarker(
        [selectedFlight.destinationInfo.lat, selectedFlight.destinationInfo.lng],
        {
          radius: 6,
          fillColor: "#f43f5e",
          fillOpacity: 0.9,
          color: "#fff",
          weight: 2,
        }
      ).bindTooltip(selectedFlight.destinationInfo.code, { 
        permanent: false,
        className: "flight-tooltip"
      }).addTo(pathLayer);

      // Traveled path (solid)
      L.polyline(
        [
          [selectedFlight.originInfo.lat, selectedFlight.originInfo.lng],
          [selectedFlight.latitude, selectedFlight.longitude],
        ],
        {
          color: "#22d3ee",
          weight: 3,
          opacity: 0.8,
        }
      ).addTo(pathLayer);

      // Remaining path (dashed)
      L.polyline(
        [
          [selectedFlight.latitude, selectedFlight.longitude],
          [selectedFlight.destinationInfo.lat, selectedFlight.destinationInfo.lng],
        ],
        {
          color: "#22d3ee",
          weight: 2,
          opacity: 0.4,
          dashArray: "8, 12",
        }
      ).addTo(pathLayer);
    }
  }, [selectedFlight]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: "500px", background: "#0a0f1a" }}
      />
    </div>
  );
}
