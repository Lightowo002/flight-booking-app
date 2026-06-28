"use client";

import { Plane } from "lucide-react";

/* Curva de ruta de vuelo usada tanto por el SVG de fondo como por el offset-path de los aviones */
const ROUTE_PATH = "M -40 360 C 180 260, 320 420, 520 280 S 780 60 860 20";

export function HeroSkyVisual() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Nubes difusas */}
      <div className="hero-cloud absolute top-[18%] left-[8%] w-40 h-14 bg-foreground/5 rounded-full blur-2xl" />
      <div className="hero-cloud absolute top-[55%] left-[2%] w-56 h-16 bg-foreground/5 rounded-full blur-2xl" style={{ animationDelay: "1.5s" }} />
      <div className="hero-cloud absolute top-[30%] right-[6%] w-48 h-16 bg-accent/10 rounded-full blur-2xl" style={{ animationDelay: "0.8s" }} />

      {/* Ruta punteada animada */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 900 460"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.25"
          strokeWidth="2"
          strokeDasharray="8 10"
          className="flight-path"
        />
      </svg>

      {/* Aviones pequeños recorriendo la ruta */}
      <div
        className="hero-fly-plane absolute"
        style={{ offsetPath: `path('${ROUTE_PATH}')`, animationDuration: "9s", animationDelay: "0s" }}
      >
        <Plane className="w-5 h-5 text-accent rotate-90 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
      </div>
      <div
        className="hero-fly-plane absolute"
        style={{ offsetPath: `path('${ROUTE_PATH}')`, animationDuration: "9s", animationDelay: "4.5s" }}
      >
        <Plane className="w-4 h-4 text-foreground/60 rotate-90" />
      </div>

      {/* Avión grande, estilo 3D, flotando */}
      <div className="hero-plane-float absolute right-[2%] top-[8%] md:right-[6%] md:top-[10%]">
        <svg width="280" height="280" viewBox="0 0 200 200" className="md:w-[360px] md:h-[360px]">
          <defs>
            <linearGradient id="fuselage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="wing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Sombra de ala trasera */}
          <ellipse cx="100" cy="150" rx="55" ry="10" fill="var(--foreground)" opacity="0.08" />

          {/* Ala principal */}
          <path d="M30 128 L96 104 L120 118 L48 150 Z" fill="url(#wing)" />
          {/* Ala trasera pequeña (cola horizontal) */}
          <path d="M118 168 L150 158 L160 168 L126 178 Z" fill="url(#wing)" opacity="0.85" />

          {/* Fuselaje */}
          <path
            d="M58 96
               C 58 78, 74 64, 96 64
               C 122 64, 158 100, 170 132
               C 174 142, 168 148, 158 146
               L 96 134
               C 74 130, 58 116, 58 96 Z"
            fill="url(#fuselage)"
          />

          {/* Nariz */}
          <path d="M58 96 C 50 96, 40 100, 36 106 C 40 110, 50 110, 58 106 Z" fill="var(--accent)" />

          {/* Cola vertical */}
          <path d="M150 90 L172 50 L182 58 L162 100 Z" fill="var(--primary)" opacity="0.9" />

          {/* Ventanas */}
          <circle cx="80" cy="92" r="3" fill="var(--background)" opacity="0.85" />
          <circle cx="94" cy="92" r="3" fill="var(--background)" opacity="0.85" />
          <circle cx="108" cy="94" r="3" fill="var(--background)" opacity="0.85" />
          <circle cx="122" cy="98" r="3" fill="var(--background)" opacity="0.85" />
          <circle cx="136" cy="104" r="3" fill="var(--background)" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}