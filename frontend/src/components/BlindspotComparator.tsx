"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Layers, ShieldAlert } from "lucide-react";
import { BlindspotItem, BrandSafetyFlag } from "@/lib/types";
import BrandSafetyBanner from "@/components/BrandSafetyBanner";

interface BlindspotComparatorProps {
  blindspots: BlindspotItem[];
  brandSafetyFlags?: BrandSafetyFlag[];
  congruenceIndex: number;
  entityName: string;
  city: string;
}

export default function BlindspotComparator({
  blindspots,
  brandSafetyFlags = [],
  congruenceIndex,
  entityName,
  city,
}: BlindspotComparatorProps) {
  if (!blindspots || blindspots.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {/* Brand Safety Airlock Alert Banner */}
      {brandSafetyFlags && brandSafetyFlags.length > 0 && (
        <BrandSafetyBanner flags={brandSafetyFlags} entityName={entityName} />
      )}

      {/* Header Metric Gauge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-5 sm:p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              The Winning Differentiator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            A/B Blindspot Comparator: Vanilla LLM vs. CultOS Qloo Grounded
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Why generalist LLMs fail in cultural curation and how Qloo empirical affinity vectors bridge the gap for <strong className="text-zinc-200">{entityName}</strong> in <strong className="text-zinc-200">{city}</strong>.
          </p>
        </div>

        {/* CCI Score Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 sm:px-5">
          <TrendingUp className="h-6 w-6 text-emerald-400" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Cultural Congruence Index
            </div>
            <div className="text-2xl font-black text-emerald-300">
              {congruenceIndex.toFixed(1)}%
              <span className="text-xs font-normal text-emerald-500/80 ml-1.5">vs 31.4% generic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Split-Screen A/B Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Generic LLM Baseline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Baseline: Vanilla LLM Hallucinations
              </span>
            </div>
            <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
              Zero Taste Grounding
            </span>
          </div>

          <div className="space-y-4">
            {blindspots.map((item, idx) => (
              <div
                key={`vanilla-${idx}`}
                className="group relative rounded-xl border border-rose-500/20 bg-zinc-950/70 p-4 transition-all hover:border-rose-500/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Domain: {item.domain}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                    <AlertTriangle className="h-3 w-3 text-rose-400" />
                    {item.vanilla_tag}
                  </span>
                </div>

                <div className="text-sm font-semibold text-rose-200/90 line-through decoration-rose-500/60 decoration-2">
                  &ldquo;{item.vanilla_hallucination}&rdquo;
                </div>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  <span className="font-semibold text-rose-400">Fatal Blindspot: </span>
                  {item.vanilla_flaw}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: CultOS Grounded Engine */}
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                CultOS: Qloo 250M+ Grounded Engine
              </span>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
              Empirical Affinity Vector
            </span>
          </div>

          <div className="space-y-4">
            {blindspots.map((item, idx) => (
              <div
                key={`grounded-${idx}`}
                className="group relative rounded-xl border border-emerald-500/25 bg-zinc-950/80 p-4 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-glow-emerald"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-mono text-[11px] font-semibold text-emerald-400 uppercase">
                      Qloo Verified Partner
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {item.affinity_score.toFixed(1)}% Affinity
                  </span>
                </div>

                <div className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                  {item.grounded_entity}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                  <span className="font-semibold text-emerald-400">Empirical Grounding: </span>
                  {item.grounded_rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
