"use client";

import React from "react";
import { Sparkles, Database, Cpu, Compass, ShieldCheck } from "lucide-react";
import { HealthResponse } from "@/lib/types";

interface HeaderProps {
  health: HealthResponse | null;
  activeSource?: string;
}

export default function Header({ health, activeSource }: HeaderProps) {
  const isQlooLive = activeSource === "live_qloo" || health?.qloo_api_configured;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-500 shadow-glow-purple">
            <Compass className="h-5 w-5 text-white animate-pulse" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#09090b] bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">CultOS</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-purple-400 border border-purple-500/20 uppercase">
                v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Autonomous Cultural Intelligence & Brand Activation Engine
            </p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Qloo API Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-xs">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-zinc-400 hidden md:inline">Taste Graph:</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isQlooLive ? 'bg-emerald-400' : 'bg-emerald-400'} animate-ping`} />
              <span className="font-mono font-medium text-zinc-200">
                {activeSource === "live_qloo" ? "Qloo 250M+ (Live)" : "Qloo Graph (Grounded)"}
              </span>
            </div>
          </div>

          {/* Gemini Agent Engine Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-xs">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-zinc-400 hidden md:inline">Reasoning:</span>
            <span className="font-mono font-medium text-emerald-400 flex items-center gap-1">
              Gemini 2.5 Flash
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </span>
          </div>

          {/* Hackathon Badge */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Qloo Agentic Hackathon</span>
          </div>
        </div>
      </div>
    </header>
  );
}
