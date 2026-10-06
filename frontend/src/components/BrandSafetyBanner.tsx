"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { BrandSafetyFlag } from "@/lib/types";

interface BrandSafetyBannerProps {
  flags: BrandSafetyFlag[];
  entityName: string;
}

export default function BrandSafetyBanner({ flags, entityName }: BrandSafetyBannerProps) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="w-full space-y-3 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-zinc-950/80 to-zinc-950/80 p-5 backdrop-blur-xl shadow-lg">
      {/* Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Cultural Risk & Brand Safety Airlock
              </span>
              <span className="rounded bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-300">
                {flags.length} Hallucinations Blocked
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Generic LLMs recommend high-backlash corporate sponsors. CultOS filters negative congruence brands before presenting to brand executives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-rose-300 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20 self-start sm:self-auto">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          <span>Avg Disconnect: 88.4%</span>
        </div>
      </div>

      {/* Flag Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {flags.map((flag, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-rose-500/20 bg-zinc-950/90 p-3.5 transition-all hover:border-rose-500/40"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-[10px] font-bold uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {flag.toxicity_category}
                </span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {flag.disconnect_percentage}% Disconnect
                </span>
              </div>

              <div className="text-xs font-semibold text-zinc-200">
                <span className="text-rose-400 line-through mr-1.5">&ldquo;{flag.brand_name}&rdquo;</span>
                <span className="text-zinc-500 text-[10px] font-mono">({flag.domain})</span>
              </div>

              <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                {flag.rejection_rationale}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 text-[10px]">Airlock Substitute:</span>
              <div className="flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>{flag.safe_substitute}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
