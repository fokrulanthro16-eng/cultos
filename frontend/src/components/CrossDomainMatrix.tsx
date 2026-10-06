"use client";

import React, { useState } from "react";
import { Shirt, Utensils, Disc, Landmark, Sparkles, Tag, ChevronRight } from "lucide-react";
import { DomainAffinityCluster } from "@/lib/types";

interface CrossDomainMatrixProps {
  clusters: DomainAffinityCluster[];
  entityName: string;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  fashion: Shirt,
  dining: Utensils,
  nightlife: Disc,
  places: Landmark,
};

export default function CrossDomainMatrix({ clusters, entityName }: CrossDomainMatrixProps) {
  const [activeTab, setActiveTab] = useState<string>(clusters[0]?.domain || "fashion");

  if (!clusters || clusters.length === 0) return null;

  const currentCluster = clusters.find((c) => c.domain === activeTab) || clusters[0];

  return (
    <div className="w-full space-y-6 rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-5 sm:p-7 backdrop-blur-xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Qloo Cross-Domain Affinity Matrix
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            Empirical Taste Graph Correlations for {entityName}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Co-occurrence indices across lifestyle vectors mined from 250M+ cultural entities.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {clusters.map((cluster) => {
            const Icon = DOMAIN_ICONS[cluster.domain] || Sparkles;
            const isActive = cluster.domain === activeTab;
            return (
              <button
                key={cluster.domain}
                type="button"
                onClick={() => setActiveTab(cluster.domain)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "border border-purple-500/40 bg-purple-500/20 text-white shadow-glow-purple"
                    : "border border-white/[0.06] bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-purple-300" : "text-zinc-400"}`} />
                <span className="capitalize">{cluster.domain}</span>
                <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400">
                  {cluster.entities.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cluster Description */}
      <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/40 rounded-xl px-4 py-2 border border-white/[0.04]">
        <span>{currentCluster.summary}</span>
        <span className="font-mono text-purple-400 font-medium">Domain: {currentCluster.domain.toUpperCase()}</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCluster.entities.map((entity) => (
          <div
            key={entity.id}
            className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950/70 p-5 transition-all hover:border-purple-500/40 hover:bg-zinc-950 hover:shadow-glow-purple"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-semibold uppercase text-zinc-500 group-hover:text-purple-400 transition-colors">
                  {entity.domain}
                </span>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {entity.affinity_score}%
                  </span>
                </div>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                {entity.name}
              </h4>

              <p className="mt-2 text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {entity.rationale}
              </p>
            </div>

            {/* Tags footer */}
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex flex-wrap gap-1.5 items-center">
              {entity.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="inline-flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-white/[0.04]"
                >
                  <Tag className="h-2.5 w-2.5 text-zinc-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
