"use client";

import React from "react";
import { Search, MapPin, Users, Sliders, Play, Zap, Loader2, Sparkles } from "lucide-react";

interface QueryInputProps {
  entityName: string;
  setEntityName: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  targetAudience: string;
  setTargetAudience: (val: string) => void;
  budgetTier: string;
  setBudgetTier: (val: string) => void;
  onAudit: () => void;
  onActivate: () => void;
  isLoadingAudit: boolean;
  isLoadingActivation: boolean;
}

const FAST_TRACK_PRESETS = [
  {
    id: "khruangbin_london",
    label: "Khruangbin — London (Summer Sonic VIP Activation)",
    name: "Khruangbin",
    city: "London",
    audience: "Audiophile Creatives & Festival VIPs",
    tier: "luxury",
    badge: "Analog Psych / Vinyl Archive",
  },
  {
    id: "peggy_gou_tokyo",
    label: "Peggy Gou — Tokyo (Cyberpunk Luxury Pop-Up)",
    name: "Peggy Gou",
    city: "Tokyo",
    audience: "Underground Electronic Fashionistas",
    tier: "luxury",
    badge: "Haute-Club / Balearic",
  },
  {
    id: "fred_again_ny",
    label: "Fred Again — New York (Underground Boiler-Room Residency)",
    name: "Fred Again..",
    city: "New York",
    audience: "Post-Lockdown Rave Community & Gorpcore Creatives",
    tier: "mega-festival",
    badge: "UK Garage / Diarist Rave",
  },
];

export default function QueryInput({
  entityName,
  setEntityName,
  city,
  setCity,
  targetAudience,
  setTargetAudience,
  budgetTier,
  setBudgetTier,
  onAudit,
  onActivate,
  isLoadingAudit,
  isLoadingActivation,
}: QueryInputProps) {
  const isAnyLoading = isLoadingAudit || isLoadingActivation;

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* 3 Fast-Track Presets Header */}
      <div className="mb-5 flex flex-col gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Fast-Track Preset Matrix (1-Click Benchmarks):
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Ground Truth Evaluated via Qloo API
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {FAST_TRACK_PRESETS.map((preset) => {
            const isSelected =
              entityName.toLowerCase() === preset.name.toLowerCase() &&
              city.toLowerCase() === preset.city.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                disabled={isAnyLoading}
                onClick={() => {
                  setEntityName(preset.name);
                  setCity(preset.city);
                  setTargetAudience(preset.audience);
                  setBudgetTier(preset.tier);
                }}
                className={`group flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/15 text-white shadow-glow-purple"
                    : "border-white/[0.07] bg-zinc-900/70 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    {preset.city}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-1">
                  {preset.label.split("(")[1]?.replace(")", "") || preset.audience}
                </div>
                <span className="mt-1 rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium text-purple-300 border border-purple-500/20">
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Entity / Artist Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <Search className="h-3.5 w-3.5 text-purple-400" />
            Cultural Entity / Performer
          </label>
          <div className="relative">
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g., Khruangbin, Peggy Gou, Fred Again.."
              disabled={isAnyLoading}
              className="w-full rounded-xl border border-white/[0.1] bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* City / Target Market */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            Target Metro / Market
          </label>
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., London, Tokyo, New York, Berlin"
              disabled={isAnyLoading}
              className="w-full rounded-xl border border-white/[0.1] bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Sub-culture / Target Audience */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <Users className="h-3.5 w-3.5 text-indigo-400" />
            Target Subcultural Segment
          </label>
          <div className="relative">
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Audiophile Creatives, Gorpcore Tastemakers"
              disabled={isAnyLoading}
              className="w-full rounded-xl border border-white/[0.1] bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Budget Tier */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            Sponsorship Budget Tier
          </label>
          <div className="relative">
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              disabled={isAnyLoading}
              className="w-full appearance-none rounded-xl border border-white/[0.1] bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="boutique">Boutique / Under-the-Radar ($50k - $150k)</option>
              <option value="mid-tier">Curated Tour Stage ($150k - $500k)</option>
              <option value="luxury">Luxury Headline Lounge ($500k - $1.5M)</option>
              <option value="mega-festival">Global Conglomerate ($1.5M+)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/[0.06] pt-5">
        <button
          type="button"
          onClick={onAudit}
          disabled={isAnyLoading || !entityName.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/20 px-6 py-3 text-sm font-semibold text-purple-200 transition-all hover:bg-purple-600/30 hover:shadow-glow-purple disabled:opacity-50"
        >
          {isLoadingAudit ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
              <span>Querying Qloo Taste Graph...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4 text-purple-300" />
              <span>1. Run Cultural Taste Audit</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onActivate}
          disabled={isAnyLoading || !entityName.trim()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-glow-emerald transition-all hover:opacity-95 hover:brightness-110 disabled:opacity-50"
        >
          {isLoadingActivation ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>ReAct Agent Synthesizing Deck...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white text-white" />
              <span>2. Generate Turnkey Brand Activation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
