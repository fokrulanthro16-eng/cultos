"use client";

import React from "react";
import {
  Globe2,
  Sparkles,
  Database,
  Compass,
  Landmark,
  ShieldCheck,
  Activity,
  Layers,
  Flame,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { HealthResponse } from "@/lib/types";

interface GlobalHeaderProps {
  health: HealthResponse | null;
  activeSource?: string;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
}

export default function GlobalHeader({
  health,
  activeSource,
  activeTab = "comparator",
  setActiveTab,
}: GlobalHeaderProps) {
  const isQlooLive = activeSource === "live_qloo" || health?.qloo_api_configured;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-500/25 bg-[#070b14]/90 backdrop-blur-2xl shadow-2xl">
      {/* VIBRANT CULTURAL LANDMARKS PANORAMA BANNER (Illustrated SVG Horizon) */}
      <div className="w-full h-8 overflow-hidden bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 relative border-b border-sky-500/15">
        <svg
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          className="w-full h-full opacity-60"
        >
          <defs>
            <linearGradient id="horizonGoldSky" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="25%" stopColor="#2dd4bf" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#f43f5e" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Golden Cultural Sunrise Horizon Arc */}
          <rect x="0" y="30" width="1440" height="2" fill="url(#horizonGoldSky)" />

          {/* Landmark 1: Torii Gate (Japan) */}
          <g fill="#38bdf8" opacity="0.8">
            <rect x="60" y="8" width="30" height="3" rx="1.5" />
            <rect x="64" y="13" width="22" height="2" />
            <rect x="66" y="8" width="3.5" height="22" />
            <rect x="80" y="8" width="3.5" height="22" />
          </g>

          {/* Landmark 2: Eiffel Tower (Paris) */}
          <g fill="#2dd4bf" opacity="0.85">
            <polygon points="210,30 216,4 218,4 224,30" />
            <rect x="212" y="18" width="10" height="2" />
            <rect x="214" y="10" width="6" height="1.5" />
            <line x1="217" y1="4" x2="217" y2="1" stroke="#2dd4bf" strokeWidth="1.5" />
          </g>

          {/* Landmark 3: Big Ben & Westminster Palace (London) */}
          <g fill="#38bdf8" opacity="0.85">
            <rect x="360" y="8" width="14" height="22" />
            <polygon points="360,8 367,1 374,8" />
            <circle cx="367" cy="13" r="2.5" fill="#facc15" />
            <rect x="376" y="16" width="40" height="14" />
          </g>

          {/* Landmark 4: Great Pyramid of Giza (Egypt) */}
          <g fill="#fbbf24" opacity="0.8">
            <polygon points="530,30 560,10 590,30" />
            <polygon points="560,10 590,30 568,30" fill="#f59e0b" opacity="0.6" />
          </g>

          {/* Landmark 5: Taj Mahal Dome & Minarets (India) */}
          <g fill="#e0e7ff" opacity="0.85">
            <rect x="710" y="14" width="32" height="16" />
            <path d="M718 14 C718 7, 734 7, 734 14 Z" fill="#e0e7ff" />
            <polygon points="726,7 726,3 727,3 727,7" stroke="#fbbf24" strokeWidth="1" />
            {/* Minarets */}
            <rect x="702" y="6" width="3.5" height="24" />
            <rect x="746" y="6" width="3.5" height="24" />
          </g>

          {/* Landmark 6: Statue of Liberty Torch & Crown (New York) */}
          <g fill="#34d399" opacity="0.85">
            <rect x="880" y="12" width="12" height="18" />
            <polygon points="882,12 886,6 890,12" />
            <circle cx="896" cy="7" r="2" fill="#fbbf24" />
            <line x1="896" y1="7" x2="894" y2="14" stroke="#34d399" strokeWidth="1.5" />
          </g>

          {/* Landmark 7: Sydney Opera House Sails (Australia) */}
          <g fill="#38bdf8" opacity="0.85">
            <path d="M1030 30 C1030 18, 1045 10, 1055 30 Z" />
            <path d="M1045 30 C1045 15, 1060 8, 1070 30 Z" />
            <path d="M1060 30 C1060 20, 1075 14, 1082 30 Z" />
          </g>

          {/* Landmark 8: Mount Fuji with Snowcap (Japan) */}
          <g fill="#818cf8" opacity="0.85">
            <polygon points="1200,30 1235,8 1270,30" />
            <polygon points="1225,14 1235,8 1245,14" fill="#ffffff" />
          </g>

          {/* Stylized Floating Cultural Clouds */}
          <path d="M140 10 Q150 4 165 8 Q175 4 185 10 Z" fill="url(#cloudGrad)" />
          <path d="M470 12 Q480 6 495 9 Q505 5 515 12 Z" fill="url(#cloudGrad)" />
          <path d="M810 9 Q820 4 835 7 Q845 3 855 9 Z" fill="url(#cloudGrad)" />
          <path d="M1130 11 Q1140 6 1155 8 Q1165 5 1175 11 Z" fill="url(#cloudGrad)" />

          {/* Celestial Stars */}
          <circle cx="280" cy="8" r="1" fill="#fbbf24" />
          <circle cx="650" cy="7" r="1.2" fill="#38bdf8" />
          <circle cx="970" cy="9" r="1" fill="#f43f5e" />
          <circle cx="1340" cy="7" r="1.2" fill="#2dd4bf" />
        </svg>

        {/* Global Cities Cultural Marquee Ribbon */}
        <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none text-[9px] font-mono tracking-widest text-sky-200/50 uppercase">
          <span>LONDON &bull; TOKYO &bull; PARIS</span>
          <span className="hidden sm:inline">250M+ GLOBAL TASTE GRAPH ENTITIES &bull; 95.2% CONGRUENCE</span>
          <span>NEW YORK &bull; BERLIN &bull; CAIRO</span>
        </div>
      </div>

      {/* MAIN NAVIGATION CONSOLE BAR */}
      <div className="mx-auto flex max-w-[1560px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity with Illustrated Cultural Hand & Cradled Globe */}
        <div className="flex items-center gap-3.5">
          {/* Stylized Illustrated Hand & Globe Emblem */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-teal-500 to-indigo-600 shadow-xl shadow-sky-500/25 border border-sky-300/40 group cursor-pointer">
            {/* SVG Hand Cradling the Cultural Globe */}
            <svg viewBox="0 0 48 48" className="h-9 w-9">
              <defs>
                <radialGradient id="globeCore" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* Glowing Outer Aura */}
              <circle cx="24" cy="20" r="14" fill="#38bdf8" opacity="0.2" className="animate-ping" style={{ animationDuration: "4s" }} />

              {/* The Cultural Globe */}
              <circle cx="24" cy="20" r="11" fill="url(#globeCore)" stroke="#bae6fd" strokeWidth="1" />
              {/* Globe Meridians & Latitude */}
              <ellipse cx="24" cy="20" rx="6" ry="11" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="13" y1="20" x2="35" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <ellipse cx="24" cy="15" rx="9" ry="3.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
              <ellipse cx="24" cy="25" rx="9" ry="3.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />

              {/* Stylized Human Hand Cradling Globe */}
              <path
                d="M14 36 C14 30, 16 26, 20 28 C22 29, 24 29, 26 28 C30 26, 32 30, 34 36 C30 38, 18 38, 14 36 Z"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
              {/* Fingers wrapping */}
              <path d="M15 31 C17 29, 20 29, 22 30" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M33 31 C31 29, 28 29, 26 30" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* Cultural Gold Star Pin */}
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-[10px] font-black text-slate-950 border-2 border-slate-900 shadow-md">
              ✦
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                Cult<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400">OS</span>
              </span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-300 border border-sky-400/30 uppercase">
                Enterprise
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                <Radio className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
                Live Qloo 250M+
              </span>
            </div>
            <p className="text-xs text-sky-200/75 hidden sm:block font-medium">
              Autonomous Cultural Intelligence & Brand Activation Engine
            </p>
          </div>
        </div>

        {/* Top Navigation Pills with Rich Stylized Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 rounded-xl border border-sky-500/20 bg-slate-900/80 p-1 backdrop-blur-md shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("comparator")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "comparator"
                  ? "bg-gradient-to-r from-sky-500 via-teal-500 to-sky-600 text-white shadow-md shadow-sky-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-300" />
              <span>[Comparator]</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("deck")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "deck"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>[Predictions •]</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("graph")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "graph"
                  ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Globe2 className="h-3.5 w-3.5 text-cyan-300" />
              <span>[Status •]</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab("matrix")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "matrix"
                  ? "bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 text-white shadow-md shadow-teal-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Landmark className="h-3.5 w-3.5 text-teal-300" />
              <span>[Venues]</span>
            </button>
          </nav>

          {/* Live Qloo API Badge with Dynamic Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-sky-400/30 bg-slate-900/90 px-3.5 py-1.5 text-xs shadow-sm">
            <Database className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-slate-400">Qloo Taste Graph:</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono font-semibold text-emerald-300">
                {activeSource === "live_qloo" ? "Live (250M+)" : "Verified Live"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
