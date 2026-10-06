"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  Sliders,
  Play,
  Zap,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Check,
  Compass,
  Flame,
} from "lucide-react";

interface LeftConsoleInputProps {
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
    label: "Khruangbin — London (Summer Sonic VIP)",
    name: "Khruangbin",
    city: "London",
    audience: "Audiophile Creatives & Festival VIPs",
    tier: "luxury",
    badge: "Indie Psych",
  },
  {
    id: "peggy_gou_tokyo",
    label: "Peggy Gou — Tokyo (Cyberpunk Pop-Up)",
    name: "Peggy Gou",
    city: "Tokyo",
    audience: "Underground Electronic Fashionistas",
    tier: "luxury",
    badge: "Haute-Club",
  },
  {
    id: "fred_again_ny",
    label: "Fred Again — New York (Boiler-Room)",
    name: "Fred Again..",
    city: "New York",
    audience: "Post-Lockdown Rave Community & Gorpcore",
    tier: "mega-festival",
    badge: "UK Garage",
  },
];

export default function LeftConsoleInput({
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
}: LeftConsoleInputProps) {
  const isAnyLoading = isLoadingAudit || isLoadingActivation;

  // Cultural Risk Tolerance Slider (0: Conservative, 50: Balanced, 100: Adventure / Underground)
  const [riskTolerance, setRiskTolerance] = useState<number>(75);

  // Human-in-the-Loop (HITL) Governance Toggles
  const [hitlApprovals, setHitlApprovals] = useState<{ [key: string]: boolean }>({
    provenance: true,
    backlash: true,
    acoustics: false,
  });

  const toggleApproval = (key: string) => {
    setHitlApprovals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getRiskLabel = (val: number) => {
    if (val < 33) return "Conservative / Mass-Friendly";
    if (val < 67) return "Balanced Cultural Resonance";
    return "Adventure / Underground Subcultural";
  };

  return (
    <div className="w-full culture-card p-5 sm:p-6 space-y-6">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Compass className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Console: Entity Target & Governance
          </span>
        </div>
        <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
          HITL Level 3 Active
        </span>
      </div>

      {/* 1-Click Fast-Track Benchmarks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-amber-400" />
            Fast-Track Presets:
          </span>
          <span className="font-mono text-[10px] text-slate-500">1-Click Matrix</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FAST_TRACK_PRESETS.map((p) => {
            const isSelected =
              entityName.toLowerCase() === p.name.toLowerCase() &&
              city.toLowerCase() === p.city.toLowerCase();

            return (
              <button
                key={p.id}
                type="button"
                disabled={isAnyLoading}
                onClick={() => {
                  setEntityName(p.name);
                  setCity(p.city);
                  setTargetAudience(p.audience);
                  setBudgetTier(p.tier);
                }}
                className={`flex flex-col text-left p-2.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? "border-sky-400 bg-sky-500/20 text-white shadow-md shadow-sky-500/10"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-white text-[11px]">{p.name}</span>
                  <span className="text-[9px] font-mono text-teal-400">{p.city}</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">{p.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Input Fields */}
      <div className="space-y-3.5">
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-200">
            <Search className="h-3 w-3 text-sky-400" />
            Artist / Entity
          </label>
          <input
            type="text"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            placeholder="e.g., Khruangbin, Peggy Gou"
            disabled={isAnyLoading}
            className="w-full rounded-xl border border-sky-500/20 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-200">
              <MapPin className="h-3 w-3 text-teal-400" />
              Location / City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., London, Tokyo"
              disabled={isAnyLoading}
              className="w-full rounded-xl border border-sky-500/20 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-200">
              <Sliders className="h-3 w-3 text-amber-400" />
              Budget Tier
            </label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value)}
              disabled={isAnyLoading}
              className="w-full rounded-xl border border-sky-500/20 bg-slate-950/80 px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            >
              <option value="boutique">Boutique ($125k)</option>
              <option value="mid-tier">Mid-Tier ($350k)</option>
              <option value="luxury">Luxury ($850k)</option>
              <option value="mega-festival">Global ($2.2M)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1 text-xs font-semibold text-slate-200">
            <Users className="h-3 w-3 text-indigo-400" />
            Target Cultural Audience
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., Festival VIPs, Audiophiles"
            disabled={isAnyLoading}
            className="w-full rounded-xl border border-sky-500/20 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Cultural Risk Tolerance Slider */}
      <div className="space-y-2 rounded-xl border border-sky-500/20 bg-slate-950/60 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Cultural Risk Tolerance:
          </span>
          <span className="font-mono text-[11px] font-bold text-amber-400">
            {riskTolerance}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={riskTolerance}
          onChange={(e) => setRiskTolerance(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Conservative</span>
          <span className="text-amber-300 font-semibold">{getRiskLabel(riskTolerance)}</span>
          <span>Adventure / Underground</span>
        </div>
      </div>

      {/* Human-in-the-Loop (HITL) Validation Matrix */}
      <div className="space-y-2.5 rounded-xl border border-emerald-500/25 bg-emerald-950/15 p-3.5">
        <div className="flex items-center justify-between text-xs border-b border-emerald-500/20 pb-2">
          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            HITL Governance Oversight:
          </span>
          <span className="font-mono text-[10px] text-emerald-400">3 Checkpoints</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[11px]">Aesthetic Provenance Verified</span>
            <button
              type="button"
              onClick={() => toggleApproval("provenance")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                hitlApprovals.provenance
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {hitlApprovals.provenance ? <Check className="h-2.5 w-2.5" /> : null}
              <span>[✔ Approve]</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[11px]">Sponsor Backlash Clearance</span>
            <button
              type="button"
              onClick={() => toggleApproval("backlash")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                hitlApprovals.backlash
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {hitlApprovals.backlash ? <Check className="h-2.5 w-2.5" /> : null}
              <span>[✔ Approve]</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[11px]">VIP Acoustic Calibration</span>
            <button
              type="button"
              onClick={() => toggleApproval("acoustics")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                hitlApprovals.acoustics
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {hitlApprovals.acoustics ? <Check className="h-2.5 w-2.5" /> : null}
              <span>[✔ Approve]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onAudit}
          disabled={isAnyLoading || !entityName.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/20 py-2.5 text-xs font-bold text-sky-200 transition-all hover:bg-sky-500/30 hover:shadow-lg hover:shadow-sky-500/20 disabled:opacity-50"
        >
          {isLoadingAudit ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-300" />
              <span>Querying Qloo Taste Graph...</span>
            </>
          ) : (
            <>
              <Search className="h-3.5 w-3.5 text-sky-300" />
              <span>1. Run Cultural Taste Audit</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onActivate}
          disabled={isAnyLoading || !entityName.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isLoadingActivation ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
              <span>Multi-Hop ReAct Synthesizing...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
              <span>2. Generate Turnkey Brand Activation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
