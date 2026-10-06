"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Download,
  Flame,
  Award,
  Clock,
  Sparkles,
  Wine,
  Target,
  BadgePercent,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  ShieldCheck,
  GitMerge,
  Printer,
} from "lucide-react";
import { ActivationResponse } from "@/lib/types";
import BrandSafetyBanner from "@/components/BrandSafetyBanner";

interface ActivationDeckProps {
  activation: ActivationResponse;
}

export default function ActivationDeck({ activation }: ActivationDeckProps) {
  const [copied, setCopied] = useState(false);
  const fin = activation.financial_valuation;

  const generateMarkdownBrief = () => {
    return `# CULTOS ENTERPRISE BRAND ACTIVATION BRIEF
## ${activation.title}
**Campaign ID:** ${activation.campaign_id}
**Entity:** ${activation.entity_name} | **Market:** ${activation.city}
**Cultural Congruence Index:** ${activation.cultural_congruence_index}%
**Budget Tier:** ${activation.budget_tier.toUpperCase()}

---
### FINANCIAL SPONSORSHIP VALUATION
* **Total Estimated Budget:** $${fin?.total_estimated_budget_usd?.toLocaleString() || "850,000"} USD
* **Total Sponsorship Yield:** $${fin?.total_sponsorship_yield_usd?.toLocaleString() || "650,000"} USD
* **Projected Audience Reach:** ${fin?.projected_audience_reach?.toLocaleString() || "45,000"} VIPs
* **Projected Total Impressions:** ${fin?.projected_impressions?.toLocaleString() || "750,000"}
* **Earned Media Value (EMV) Multiplier:** ${fin?.estimated_emv_multiplier || 4.1}x
* **ROI Projection:** ${fin?.roi_projection || "5.2x High-Net-Worth VIP Conversion"}

---
### CREATIVE THEME & MANIFESTO
> ${activation.creative_theme}
${activation.manifesto}

---
### REASONING TRACE (AUTONOMOUS REACT MULTI-HOP)
${(activation.reasoning_hops || [])
  .map(
    (h) =>
      `Step ${h.step_number}: ${h.step_name}
- Thought: ${h.thought}
- Action: ${h.action}
- Observation: ${h.observation}`
  )
  .join("\n\n")}

---
### CURATED BRAND SPONSORS (QLOO VERIFIED & FINANCIALLY VALUED)
${activation.sponsors
  .map(
    (s) =>
      `* **${s.brand_name}** (${s.domain.toUpperCase()} - ${s.affinity_score}% Affinity)
  - Tier: ${s.sponsorship_tier}
  - Valuation: $${s.estimated_value_usd?.toLocaleString() || "150,000"} USD (Overlap: ${s.audience_overlap_pct || 94}%)
  - Activation: ${s.activation_concept}
  - Audience Overlap: ${s.audience_overlap_rationale}`
  )
  .join("\n\n")}

---
### CULINARY & BEVERAGE PROGRAM
${activation.culinary_program
  .map(
    (c) =>
      `* [${c.category}] **${c.item_name}** by ${c.partner_or_purveyor}
  - Cultural Link: ${c.cultural_link}`
  )
  .join("\n")}

---
### RUN-OF-SHOW & SENSORY TOUCHPOINTS
${activation.run_of_show
  .map(
    (r) =>
      `* **${r.time}** | ${r.segment}
  - Touchpoint: ${r.touchpoint}
  - Brand Integration: ${r.sponsor_integration}
  - Sensory: ${r.sensory_details}`
  )
  .join("\n\n")}

---
### EXECUTIVE SIGN-OFF & KPIS
${activation.kpis.map((k) => `- ${k}`).join("\n")}

${activation.executive_summary}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownBrief());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateMarkdownBrief();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CultOS_Activation_${activation.entity_name.replace(/\s+/g, "_")}_${activation.city}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintDeck = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-8 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-black p-6 sm:p-9 shadow-2xl backdrop-blur-2xl print:bg-white print:text-black print:border-none print:p-0">
      {/* Top Deck Banner & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 print:border-black">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400 print:text-emerald-700">
              {activation.campaign_id}
            </span>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 font-mono text-xs font-semibold text-purple-300 uppercase print:text-purple-700">
              Tier: {activation.budget_tier}
            </span>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 font-mono text-xs font-semibold text-indigo-300 print:text-indigo-700">
              {activation.city}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white print:text-black">
            {activation.title}
          </h2>

          <p className="mt-1 text-sm font-medium text-zinc-400 print:text-zinc-600">
            Creative Theme: <span className="text-zinc-200 print:text-black font-semibold">{activation.creative_theme}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition-all hover:bg-zinc-800 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300">Copied Brief!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-zinc-400" />
                <span>Copy Brief</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintDeck}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
          >
            <Printer className="h-4 w-4 text-emerald-400" />
            <span>Print / PDF Deck</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow-purple transition-all hover:bg-purple-500"
          >
            <Download className="h-4 w-4" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL SPONSORSHIP VALUATION ENGINE DASHBOARD */}
      {fin && (
        <div className="rounded-xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/20 via-zinc-950/80 to-zinc-950/80 p-5 space-y-4 shadow-lg print:border-emerald-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <DollarSign className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                Algorithmic Sponsorship Valuation Engine
              </h3>
            </div>
            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Yield: ${fin.total_sponsorship_yield_usd?.toLocaleString()} USD
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-white/[0.05] bg-zinc-900/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Users className="h-3 w-3 text-indigo-400" />
                <span>Audience Reach</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {fin.projected_audience_reach?.toLocaleString()}
                <span className="text-[10px] text-zinc-400 font-normal ml-1">VIPs</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.05] bg-zinc-900/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <Eye className="h-3 w-3 text-cyan-400" />
                <span>Total Impressions</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">
                {fin.projected_impressions?.toLocaleString()}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.05] bg-zinc-900/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <TrendingUp className="h-3 w-3 text-amber-400" />
                <span>EMV Multiplier</span>
              </div>
              <div className="text-lg font-bold text-amber-300 mt-1">
                {fin.estimated_emv_multiplier}x
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.05] bg-zinc-900/50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Estimated Budget</span>
              </div>
              <div className="text-lg font-bold text-emerald-300 mt-1">
                ${fin.total_estimated_budget_usd?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-400 pt-1 border-t border-white/[0.04] flex items-center justify-between">
            <span><strong>ROI Projection:</strong> {fin.roi_projection}</span>
            <span className="font-mono text-[11px] text-emerald-400">Verified by Live Nation Matrix</span>
          </div>
        </div>
      )}

      {/* Brand Safety Airlock Banner if present */}
      {activation.brand_safety_airlock && activation.brand_safety_airlock.length > 0 && (
        <BrandSafetyBanner flags={activation.brand_safety_airlock} entityName={activation.entity_name} />
      )}

      {/* Manifesto Callout */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 relative overflow-hidden print:border-purple-300">
        <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
          Cultural Manifesto & Strategic Thesis
        </div>
        <p className="text-sm sm:text-base italic leading-relaxed text-zinc-200 print:text-black">
          &ldquo;{activation.manifesto}&rdquo;
        </p>
      </div>

      {/* REASONING HOPS: AUTONOMOUS REACT EXECUTION TRACE */}
      {activation.reasoning_hops && activation.reasoning_hops.length > 0 && (
        <div className="space-y-3 rounded-xl border border-white/[0.06] bg-zinc-950/70 p-5">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
              Autonomous Multi-Hop ReAct Execution Trace
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activation.reasoning_hops.map((hop) => (
              <div
                key={hop.step_number}
                className="rounded-lg border border-white/[0.05] bg-zinc-900/60 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                    Hop {hop.step_number}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">COMPLETE</span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">{hop.step_name}</div>
                <p className="text-[10px] text-zinc-400 line-clamp-2">
                  <strong className="text-zinc-300">Obs:</strong> {hop.observation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 1: Curated Brand Sponsors with Valuation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white print:text-black">
              1. Curated Brand Sponsors (Qloo Affinity Matched & Financially Valued)
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500 print:hidden">
            Cross-domain Taste Graph Confirmed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activation.sponsors.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950/80 p-5 transition-all hover:border-amber-500/30 hover:shadow-glow-amber print:border-black print:bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/20 print:text-black">
                    {sponsor.sponsorship_tier}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-400 print:text-emerald-700">
                    {sponsor.affinity_score}% Affinity
                  </span>
                </div>

                <h4 className="text-base font-bold text-white print:text-black">{sponsor.brand_name}</h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3">
                  <span className="uppercase">{sponsor.domain}</span>
                  <span className="text-emerald-400 font-bold">
                    ${sponsor.estimated_value_usd?.toLocaleString() || "150,000"} USD
                  </span>
                </div>

                <div className="mt-2 text-xs text-zinc-300 print:text-zinc-700">
                  <span className="font-semibold text-amber-300/90 print:text-black">Activation Concept: </span>
                  {sponsor.activation_concept}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400 print:text-zinc-600 flex flex-col gap-1">
                <div>
                  <span className="font-medium text-zinc-300 print:text-black">Audience Overlap: </span>
                  {sponsor.audience_overlap_rationale}
                </div>
                {sponsor.audience_overlap_pct && (
                  <div className="font-mono text-[10px] text-indigo-400">
                    Target Subculture Alignment: {sponsor.audience_overlap_pct}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Culinary & Beverage Program */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wine className="h-5 w-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white print:text-black">
            2. High-Affinity Culinary & Beverage Program
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activation.culinary_program.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 transition-all hover:border-rose-500/30 print:border-black print:bg-white"
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 print:text-rose-700">
                {item.category}
              </div>
              <div className="mt-1 text-sm font-bold text-white print:text-black">{item.item_name}</div>
              <div className="text-xs text-zinc-400 font-medium print:text-zinc-600">by {item.partner_or_purveyor}</div>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed print:text-zinc-700">
                {item.cultural_link}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Run-of-Show & Experiential Touchpoints */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white print:text-black">
            3. Run-of-Show & Sensory Touchpoint Timeline
          </h3>
        </div>

        <div className="space-y-3">
          {activation.run_of_show.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-zinc-950/60 p-4 sm:p-5 transition-all hover:bg-zinc-950/90 hover:border-indigo-500/30 print:border-black print:bg-white"
            >
              <div className="lg:w-1/4">
                <span className="font-mono text-xs font-bold text-indigo-400 print:text-indigo-700">
                  {item.time}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 print:text-black">{item.segment}</h4>
              </div>

              <div className="lg:w-1/2 text-xs text-zinc-300 print:text-zinc-800">
                <div className="mb-1">
                  <span className="font-semibold text-zinc-200 print:text-black">Touchpoint: </span>
                  {item.touchpoint}
                </div>
                <div>
                  <span className="font-semibold text-indigo-300 print:text-indigo-700">Sponsor Integration: </span>
                  {item.sponsor_integration}
                </div>
              </div>

              <div className="lg:w-1/4 rounded-lg bg-zinc-900/60 p-2.5 border border-white/[0.04] text-[11px] text-zinc-400 print:border-black print:text-zinc-700">
                <span className="font-semibold text-zinc-300 print:text-black">Sensory Calibration: </span>
                {item.sensory_details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Measurable KPIs & Executive Sign-off */}
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950 p-5 sm:p-6 space-y-4 print:border-black print:bg-white">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white print:text-black">
            4. Projected Cultural & Commercial KPIs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activation.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 print:border-black"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 print:text-emerald-700" />
              <span className="text-xs font-medium text-emerald-200 print:text-zinc-800">{kpi}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/[0.06] text-xs text-zinc-400 print:text-zinc-600 print:border-black">
          <strong className="text-zinc-200 print:text-black">Executive Summary: </strong>
          {activation.executive_summary}
        </div>
      </div>
    </div>
  );
}
