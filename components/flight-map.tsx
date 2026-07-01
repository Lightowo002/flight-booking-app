// components/FlightMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FlightState, SelectedFlight } from "@/types/flight";

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
  // ✨ CAMBIO CLAVE: Usar estado en lugar de Ref para que React sepa cuándo el mapa está listo
  const [map, setMap] = useState<L.Map | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const pathLayerRef = useRef<L.LayerGroup | null>(null);
  const isInitializedRef = useRef(false);
  const onSelectFlightRef = useRef(onSelectFlight);

  // Mantener la referencia del callback actualizada
  useEffect(() => {
    onSelectFlightRef.current = onSelectFlight;
  }, [onSelectFlight]);

  // 1. Inicializar el mapa una sola vez
  useEffect(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log("🗺️ Inicializando el mapa de Leaflet...");

    const mapInstance = L.map(mapContainerRef.current, {
      center: [-12.0464, -77.0428], // Centrado en Sudamérica / Perú
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapInstance);

    pathLayerRef.current = L.layerGroup().addTo(mapInstance);

    // Guardamos la instancia en el estado de React
    setMap(mapInstance);

    return () => {
      console.log("🗑️ Limpiando instancia del mapa");
      mapInstance.remove();
      setMap(null);
      pathLayerRef.current = null;
      isInitializedRef.current = false;
      markersRef.current.clear();
    };
  }, []);

  // 2. Dibujar o actualizar marcadores cuando cambien los vuelos O el mapa esté listo
  useEffect(() => {
    // Si el mapa aún no se ha creado, no hacemos nada y esperamos al siguiente ciclo
    if (!map) {
      console.log("⏳ Esperando que el mapa esté listo para dibujar marcadores...");
      return;
    }

    console.log(`✈️ Dibujando ${flights.length} aviones en el mapa...`);

    const currentMarkers = markersRef.current;
    const flightIds = new Set(flights.map((f) => f.icao24));

    // Eliminar marcadores viejos
    currentMarkers.forEach((marker, id) => {
      if (!flightIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Agregar o actualizar marcadores nuevos
    flights.forEach((flight) => {
      if (typeof flight.latitude !== "number" || typeof flight.longitude !== "number") {
        return;
      }

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
  }, [flights, selectedFlight?.icao24, map]); // ✨ Agregado 'map' como dependencia

// 3. Dibujar rutas del avión seleccionado
  useEffect(() => {
    const pathLayer = pathLayerRef.current;
    if (!pathLayer || !map) return;

    pathLayer.clearLayers();
    if (!selectedFlight) return;

    // Validación segura: Accedemos a las propiedades con encadenamiento opcional
    const origin = selectedFlight.originInfo;
    const destination = selectedFlight.destinationInfo;

    const hasValidRoute =
      origin &&
      destination &&
      typeof origin.lat === "number" &&
      typeof origin.lng === "number" &&
      typeof destination.lat === "number" &&
      typeof destination.lng === "number";

    // Si los datos son válidos, procedemos a dibujar
    if (hasValidRoute) {
      // TypeScript ahora sabe que origin y destination existen aquí
      const oLat = origin.lat;
      const oLng = origin.lng;
      const dLat = destination.lat;
      const dLng = destination.lng;

      L.circleMarker([oLat, oLng], {
        radius: 6,
        fillColor: "#22d3ee",
        fillOpacity: 0.9,
        color: "#fff",
        weight: 2,
      })
        .bindTooltip(origin.code, { permanent: false, className: "flight-tooltip" })
        .addTo(pathLayer);

      L.circleMarker([dLat, dLng], {
        radius: 6,
        fillColor: "#f43f5e",
        fillOpacity: 0.9,
        color: "#fff",
        weight: 2,
      })
        .bindTooltip(destination.code, { permanent: false, className: "flight-tooltip" })
        .addTo(pathLayer);

      // Dibujar línea de origen a avión
      L.polyline([[oLat, oLng], [selectedFlight.latitude, selectedFlight.longitude]], {
        color: "#22d3ee",
        weight: 3,
        opacity: 0.8,
      }).addTo(pathLayer);

      // Dibujar línea de avión a destino
      L.polyline([[selectedFlight.latitude, selectedFlight.longitude], [dLat, dLng]], {
        color: "#22d3ee",
        weight: 2,
        opacity: 0.4,
        dashArray: "8, 12",
      }).addTo(pathLayer);
    }
  }, [selectedFlight, map]);

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