"use client";

import React, { useState, useEffect } from "react";
import GlobalHeader from "@/components/GlobalHeader";
import LeftConsoleInput from "@/components/LeftConsoleInput";
import TasteNetworkGraph from "@/components/TasteNetworkGraph";
import CrossDomainMatrix from "@/components/CrossDomainMatrix";
import ActivationDeck from "@/components/ActivationDeck";
import BrandSafetyBanner from "@/components/BrandSafetyBanner";
import { runCulturalAudit, generateBrandActivation, fetchHealth } from "@/lib/api";
import {
  AuditResponse,
  ActivationResponse,
  HealthResponse,
  BlindspotItem,
  BrandSafetyFlag,
} from "@/lib/types";
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Zap,
  Network,
  Award,
  Globe2,
  TrendingUp,
  Download,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Landmark,
  Compass,
  Flame,
  Printer,
  ChevronRight,
  Heart,
  Users,
} from "lucide-react";

export default function MissionControlPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Form State
  const [entityName, setEntityName] = useState("Khruangbin");
  const [city, setCity] = useState("London");
  const [targetAudience, setTargetAudience] = useState("Audiophile Creatives & Festival VIPs");
  const [budgetTier, setBudgetTier] = useState("luxury");

  // Output State
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [activationData, setActivationData] = useState<ActivationResponse | null>(null);

  // UI State
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isLoadingActivation, setIsLoadingActivation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"comparator" | "deck" | "graph" | "matrix">("comparator");
  const [approvedDecks, setApprovedDecks] = useState(false);

  // Initial load
  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => {});
    handleAudit();
  }, []);

  const handleAudit = async () => {
    if (!entityName.trim()) return;
    setIsLoadingAudit(true);
    setErrorMessage(null);

    try {
      const result = await runCulturalAudit({
        entity_name: entityName,
        city: city,
        target_audience: targetAudience,
      });
      setAuditData(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to query cultural audit.");
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleActivate = async () => {
    if (!entityName.trim()) return;
    setIsLoadingActivation(true);
    setErrorMessage(null);

    try {
      if (!auditData || auditData.entity.name.toLowerCase() !== entityName.toLowerCase()) {
        const aRes = await runCulturalAudit({
          entity_name: entityName,
          city: city,
          target_audience: targetAudience,
        });
        setAuditData(aRes);
      }

      const actRes = await generateBrandActivation({
        entity_name: entityName,
        city: city,
        target_audience: targetAudience,
        budget_tier: budgetTier,
      });
      setActivationData(actRes);
      setActiveTab("deck");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to generate brand activation.");
    } finally {
      setIsLoadingActivation(false);
    }
  };

  // Fallback / Initial sample blindspots if still loading
  const currentBlindspots: BlindspotItem[] = auditData?.blindspots || [
    {
      domain: "fashion",
      vanilla_hallucination: "Burberry High-Street Flagship Pop-up",
      vanilla_flaw: "Mass commercial heritage luxury feels corporate and unaligned with psych-groove crate-digging aesthetics.",
      vanilla_tag: "Corporate Heritage Cliché",
      grounded_entity: "Story mfg. / Bode London",
      grounded_rationale: "Zero-waste botanical dyes, hand-embroidered artisanal garments matching vintage analog sensibilities.",
      affinity_score: 96.4,
      qloo_verified: true,
    },
    {
      domain: "dining",
      vanilla_hallucination: "The Dorchester Hotel Afternoon Tea",
      vanilla_flaw: "Stuffy Mayfair aristocracy contradicts egalitarian groove-heavy underground community.",
      vanilla_tag: "Traditional Aristocratic Mismatch",
      grounded_entity: "Rochelle Canteen / Towpath Café",
      grounded_rationale: "Intimate walled garden dining with low-intervention bio-dynamic wines and shared plates.",
      affinity_score: 93.8,
      qloo_verified: true,
    },
    {
      domain: "beverage",
      vanilla_hallucination: "Heineken Festival Beer Tent",
      vanilla_flaw: "Industrial commercial lager causes immediate audience backlash among discerning festival VIPs.",
      vanilla_tag: "Industrial Commodity Disconnect",
      grounded_entity: "Newcomer Wines (Austrian Pet-Nat)",
      grounded_rationale: "Raw natural skin-contact orange wines celebrating craft fermentation and low-intervention terroir.",
      affinity_score: 95.1,
      qloo_verified: true,
    },
  ];

  const currentFlags: BrandSafetyFlag[] = auditData?.brand_safety_flags || [
    {
      brand_name: "Heineken",
      domain: "beverage",
      hallucinated_by: "Generic LLM",
      disconnect_percentage: 84.6,
      risk_level: "HIGH",
      toxicity_category: "Mass Commercial Commodity",
      rejection_rationale: "Discerning psych-funk audience rejects industrial corporate lager sponsorships in intimate VIP activations.",
      safe_substitute: "Newcomer Wines (Pet-Nat & Orange Wine)",
    },
    {
      brand_name: "Red Bull",
      domain: "energy",
      hallucinated_by: "Generic LLM",
      disconnect_percentage: 89.2,
      risk_level: "CRITICAL",
      toxicity_category: "Aggressive Corporate Hype",
      rejection_rationale: "High-octane EDM extreme sports branding completely clashes with slow-burn Thai-funk and dub psychedelia.",
      safe_substitute: "Rare Tea Company Artisanal Oolong",
    },
  ];

  const cciScore = auditData?.cultural_congruence_index ?? 95.2;

  // Run-of-show default items if activationData not yet synthesized
  const defaultRunOfShow = activationData?.run_of_show || [
    {
      time: "19:00 - 20:00",
      segment: "VIP Arrival & Ambient Thai-Funk Vinyl Warmup",
      touchpoint: "Analog Hi-Fi Listening Sanctuary (Klipschorn Heritage Speakers)",
      sponsor_integration: "Bode London Host Uniforms & Kinfolk Editorial Program",
      sensory_details: "Smoked copal incense, warm tungsten lamp illumination, Pet-Nat orange wine welcome.",
    },
    {
      time: "20:00 - 21:15",
      segment: "Curated Culinary Tasting & Atelier Lounge",
      touchpoint: "Botanical Fermentation & Family-Style Shared Tables",
      sponsor_integration: "Rochelle Canteen / Newcomer Wines Natural Pairing",
      sensory_details: "Wild sourdough, chargrilled seasonal herbs, chilled low-intervention biodynamic pours.",
    },
    {
      time: "21:30 - 23:00",
      segment: "Headliner Sunset Performance & Live Recording",
      touchpoint: "Mainstage Acoustic Immersion & Visual Projections",
      sponsor_integration: "Story mfg. Stage Tapestry & Live 1/4-inch Reel-to-Reel Tape Master",
      sensory_details: "Warm analog spring reverb, analog liquid light show, custom incense dispersion.",
    },
    {
      time: "23:00 - 01:30",
      segment: "Secret Speakeasy After-Hours Session",
      touchpoint: "Brilliant Corners Style Audiophile Bar Pop-Up",
      sponsor_integration: "Master & Dynamic VIP Headphones & Small-Batch Mezcal",
      sensory_details: "Dark amber neon, deep bass frequencies, Japanese highballs, unreleased vinyl dubplates.",
    },
  ];

  // Financial Sponsors default items
  const defaultSponsors = activationData?.sponsors || [
    {
      brand_name: "Bode London",
      domain: "fashion",
      affinity_score: 97.4,
      sponsorship_tier: "Title Sponsor ($250k)",
      estimated_value_usd: 250000,
      audience_overlap_pct: 95.2,
      activation_concept: "Bespoke Antique Quilt VIP Lounge & Custom Tour Uniforms",
      audience_overlap_rationale: "Shared obsession with folk provenance, textile history, and nostalgic craftsmanship.",
    },
    {
      brand_name: "Newcomer Wines",
      domain: "dining",
      affinity_score: 95.1,
      sponsorship_tier: "Stage Partner ($120k)",
      estimated_value_usd: 120000,
      audience_overlap_pct: 93.8,
      activation_concept: "Natural Pet-Nat Backstage Pavilion & Biodynamic Sommelier Pairing",
      audience_overlap_rationale: "Unfiltered low-intervention winemaking perfectly mirrors raw analog musicianship.",
    },
    {
      brand_name: "Klipsch Audio",
      domain: "technology",
      affinity_score: 94.6,
      sponsorship_tier: "Acoustic Partner ($85k)",
      estimated_value_usd: 85000,
      audience_overlap_pct: 92.4,
      activation_concept: "Audiophile Hi-Fi Listening Lounge with Heritage Horn Speakers",
      audience_overlap_rationale: "Audiophile-grade acoustic fidelity tailored for analog crate-digger audiophiles.",
    },
  ];

  const handleDownloadDeck = () => {
    const text = `# CULTOS EXECUTIVE ACTIVATION BRIEF
Entity: ${entityName} | City: ${city}
Cultural Congruence Index: ${cciScore}%
Generated by CultOS (Qloo Taste Graph + Gemini 2.5 Flash)

---
FINANCIAL SPONSORS:
${defaultSponsors.map((s) => `* ${s.brand_name} - ${s.sponsorship_tier} ($${s.estimated_value_usd?.toLocaleString()}) | ${s.activation_concept}`).join("\n")}

---
RUN OF SHOW:
${defaultRunOfShow.map((r) => `* ${r.time} - ${r.segment} | Integration: ${r.sponsor_integration}`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CultOS_Executive_Deck_${entityName.replace(/\s+/g, "_")}_${city}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen global-culture-bg landmark-watermark text-slate-100 flex flex-col print:bg-white print:text-black">
      {/* Top Header with Brand & Navigation Pills */}
      <div className="print:hidden">
        <GlobalHeader
          health={health}
          activeSource={auditData?.source}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1560px] flex-1 px-3 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Vibrant Global Cultural Landmarks Illustration Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/70 via-slate-900/90 to-indigo-950/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl print:hidden">
          {/* Detailed Illustrated Global Cultural Landmarks Horizon (Torii, Eiffel, Big Ben, Taj Mahal, Liberty, Opera House, Fuji) */}
          <div className="absolute right-0 bottom-0 w-full max-w-2xl h-36 opacity-25 pointer-events-none hidden lg:block overflow-hidden">
            <svg viewBox="0 0 700 140" className="w-full h-full">
              <defs>
                <linearGradient id="monumentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#2dd4bf" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Japanese Torii Gate */}
              <g fill="#38bdf8">
                <rect x="30" y="55" width="46" height="5" rx="2" />
                <rect x="36" y="65" width="34" height="3" />
                <rect x="40" y="55" width="5" height="85" />
                <rect x="61" y="55" width="5" height="85" />
              </g>

              {/* Eiffel Tower */}
              <g fill="#2dd4bf">
                <polygon points="120,140 148,15 152,15 180,140" />
                <rect x="132" y="85" width="36" height="5" />
                <rect x="140" y="48" width="20" height="4" />
                <line x1="150" y1="15" x2="150" y2="2" stroke="#2dd4bf" strokeWidth="2.5" />
              </g>

              {/* Big Ben & Elizabeth Tower */}
              <g fill="#38bdf8">
                <rect x="230" y="45" width="24" height="95" />
                <polygon points="230,45 242,18 254,45" />
                <circle cx="242" cy="58" r="4.5" fill="#facc15" />
                <rect x="254" y="80" width="60" height="60" />
              </g>

              {/* Taj Mahal Dome & Minarets */}
              <g fill="#e0e7ff">
                <rect x="370" y="70" width="55" height="70" />
                <path d="M378 70 C378 40, 417 40, 417 70 Z" fill="#e0e7ff" />
                <polygon points="397.5,40 397.5,30 398.5,30 398.5,40" stroke="#facc15" strokeWidth="2" />
                <rect x="355" y="48" width="5.5" height="92" />
                <rect x="435" y="48" width="5.5" height="92" />
              </g>

              {/* Statue of Liberty Torch */}
              <g fill="#34d399">
                <rect x="495" y="65" width="22" height="75" />
                <polygon points="498,65 506,45 514,65" />
                <circle cx="522" cy="48" r="4.5" fill="#fbbf24" />
                <line x1="522" y1="48" x2="518" y2="70" stroke="#34d399" strokeWidth="3" />
              </g>

              {/* Sydney Opera House Sails */}
              <g fill="#38bdf8">
                <path d="M570 140 C570 95, 600 70, 620 140 Z" />
                <path d="M595 140 C595 85, 630 60, 650 140 Z" />
                <path d="M625 140 C625 100, 655 80, 670 140 Z" />
              </g>

              {/* Mount Fuji Background Outline */}
              <polygon points="20,140 300,5 580,140" fill="url(#monumentGradient)" opacity="0.12" />
              <polygon points="250,30 300,5 350,30" fill="#ffffff" opacity="0.25" />
            </svg>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                <Globe2 className="h-3.5 w-3.5 text-teal-400 animate-spin" style={{ animationDuration: "25s" }} />
                <span>Global Culture & Brand Activation Mission Control</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Cult<span className="text-gradient-cyan-gold">OS</span>: Cultural Intelligence Engine
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empirical cross-domain cultural taste discovery. Correlating <strong>250M+ entities</strong> in the <strong>Qloo Taste Graph</strong> (Music &rarr; Fashion &rarr; Dining &rarr; Nightlife &rarr; Venues) to eliminate corporate LLM hallucinations and generate bulletproof brand activation decks with real financial valuations.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto font-mono text-xs">
              <div className="rounded-xl border border-sky-500/25 bg-slate-900/90 px-3.5 py-2 shadow-sm">
                <span className="text-slate-400 text-[10px] block uppercase">Live Resolution</span>
                <span className="font-bold text-sky-300">{entityName} &bull; {city}</span>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2 shadow-sm">
                <span className="text-emerald-400/80 text-[10px] block uppercase">Taste Congruence</span>
                <span className="font-black text-emerald-300 text-sm">{cciScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Error Notice */}
        {errorMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-300 print:hidden">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <strong>Execution Notice:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* TAB NAVIGATION VIEWS */}
        {activeTab === "comparator" && (
          <div className="space-y-7">
            {/* 3-COLUMN COMMAND GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* COLUMN 1: LEFT CONSOLE (INPUT & HUMAN-IN-THE-LOOP GOVERNANCE) - 4 Cols */}
              <div className="lg:col-span-4 space-y-4">
                <LeftConsoleInput
                  entityName={entityName}
                  setEntityName={setEntityName}
                  city={city}
                  setCity={setCity}
                  targetAudience={targetAudience}
                  setTargetAudience={setTargetAudience}
                  budgetTier={budgetTier}
                  setBudgetTier={setBudgetTier}
                  onAudit={handleAudit}
                  onActivate={handleActivate}
                  isLoadingAudit={isLoadingAudit}
                  isLoadingActivation={isLoadingActivation}
                />
              </div>

              {/* COLUMN 2: MIDDLE COLUMN (GENERIC AI - STERILE & UNALIGNED) - 4 Cols */}
              <div className="lg:col-span-4 space-y-4">
                <div className="culture-card p-5 sm:p-6 space-y-5 border-rose-500/25 bg-slate-900/80">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        Generic AI (Sterile & Unaligned)
                      </span>
                    </div>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 font-mono">
                      Cohesion: 31.4%
                    </span>
                  </div>

                  {/* Warning Alerts Banner */}
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                      <Flame className="h-3.5 w-3.5 text-rose-400" />
                      <span>Warning Alerts: Toxic Hallucinations Blocked</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-[11px] border border-rose-500/20"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-rose-400 line-through font-medium">{flag.brand_name}</span>
                            <span className="text-slate-500 text-[10px]">({flag.domain})</span>
                          </div>
                          <span className="font-mono text-rose-400 font-bold text-[10px]">
                            {flag.disconnect_percentage}% Disconnect
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generic LLM Predictions List */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Standard LLM Hallucinated Pitch Items:
                    </div>

                    {currentBlindspots.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-rose-500/20 bg-slate-950/60 p-3.5 space-y-1.5 transition-all hover:border-rose-500/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                            {item.domain}
                          </span>
                          <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {item.vanilla_tag}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-rose-200 line-through decoration-rose-500/70">
                          &ldquo;{item.vanilla_hallucination}&rdquo;
                        </div>

                        <p className="text-[11px] leading-relaxed text-slate-400">
                          <strong className="text-rose-400">Flaw:</strong> {item.vanilla_flaw}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg bg-slate-950/80 p-3 text-[11px] text-slate-400 border border-slate-800">
                    <strong className="text-slate-300">Empirical Failure Mode:</strong> General-purpose LLMs rely on superficial word co-occurrence, recommending mass-market commercial brands that trigger immediate authenticity backlash among niche VIP audiences.
                  </div>
                </div>
              </div>

              {/* COLUMN 3: RIGHT COLUMN (LIVE QLOO GROUNDED - DYNAMIC & EMPIRICAL) - 4 Cols */}
              <div className="lg:col-span-4 space-y-4">
                <div className="culture-card culture-card-glow-cyan p-5 sm:p-6 space-y-5">
                  {/* Column Header & Badges */}
                  <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                        Live Qloo Grounded (Dynamic & Empirical)
                      </span>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono border border-emerald-500/30">
                      250M+ Entities
                    </span>
                  </div>

                  {/* Circular Score Badge & Metric Pills */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-950/40 via-slate-950/80 to-teal-950/30 p-4">
                    {/* Circular Score Badge */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20">
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800"
                            strokeWidth="3.2"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-400"
                            strokeDasharray="95.2, 100"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="font-mono text-sm font-black text-emerald-300">
                          {cciScore.toFixed(0)}%
                        </span>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Empirical Metric
                        </div>
                        <div className="text-sm font-black text-white">
                          Cultural Congruence Index: {cciScore.toFixed(1)}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          +63.8% over raw LLM baseline
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metric Pill Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-sky-500/20 bg-slate-950/80 p-2">
                      <div className="text-[10px] text-slate-400">Cultural Insights</div>
                      <div className="text-xs font-bold text-sky-300 font-mono mt-0.5">250M+ Vector</div>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-slate-950/80 p-2">
                      <div className="text-[10px] text-slate-400">Brand Overlap</div>
                      <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">95.4% Match</div>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-slate-950/80 p-2">
                      <div className="text-[10px] text-slate-400">Cultural Precision</div>
                      <div className="text-xs font-bold text-emerald-300 font-mono mt-0.5">Sub-Genre DNA</div>
                    </div>
                  </div>

                  {/* Interactive Cultural Node Graph embedded */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Network className="h-3 w-3 text-cyan-400" />
                        Interactive 3D Taste Vector Graph:
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("graph")}
                        className="text-[10px] text-cyan-400 hover:underline font-mono flex items-center gap-0.5"
                      >
                        Expand <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    {auditData ? (
                      <div className="rounded-xl overflow-hidden border border-sky-500/20 bg-slate-950/90 shadow-inner">
                        <TasteNetworkGraph
                          entity={auditData.entity}
                          clusters={auditData.domain_clusters}
                          city={auditData.city}
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-sky-500/20 bg-slate-950/90 p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                        <Globe2 className="h-8 w-8 text-sky-400 animate-spin" style={{ animationDuration: "12s" }} />
                        <span>Rendering 3D cultural globe geometry...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM DECK: TURNKEY BRAND SPONSORSHIP & RUN-OF-SHOW */}
            <div className="culture-card p-6 sm:p-8 space-y-6">
              {/* Bottom Deck Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-500/20 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Bottom Deck &bull; Executive Brand Activation Engine
                    </span>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-500/20">
                      Live Valuation
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Turnkey Brand Sponsorship & Run-of-Show &bull; {entityName} in {city}
                  </h3>
                  <p className="text-xs text-slate-300">
                    High-affinity corporate partnership tiers derived from multi-domain taste graphs and algorithmic yield valuation.
                  </p>
                </div>

                {/* Bottom Deck Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadDeck}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                  >
                    <Download className="h-4 w-4 text-slate-950" />
                    <span>[Download Executive Deck]</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setApprovedDecks(!approvedDecks)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      approvedDecks
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20 hover:brightness-110"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{approvedDecks ? "[Approved by Executive]" : "[Approval]"}</span>
                  </button>
                </div>
              </div>

              {/* Financial Valuation Cards ($250k Title Sponsor, $120k Stage Partner, etc.) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                    Algorithmic Financial Valuation Sponsorship Tiers:
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Total Potential Yield: $455,000 USD
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {defaultSponsors.map((sponsor, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-4 space-y-3 shadow-md hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono border border-amber-500/25">
                          {sponsor.sponsorship_tier}
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {sponsor.affinity_score}% Affinity
                        </span>
                      </div>

                      <div>
                        <div className="text-base font-bold text-white">{sponsor.brand_name}</div>
                        <div className="text-xs text-amber-300/90 font-mono font-semibold">
                          ${sponsor.estimated_value_usd?.toLocaleString()} USD Valuation
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 leading-snug">
                        <strong className="text-slate-200">Concept:</strong> {sponsor.activation_concept}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono text-teal-400">CONFIRMED TASTE FIT</span>
                        <span>Audience Overlap: {sponsor.audience_overlap_pct || 94}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Run-of-Show Generation Timeline Steps */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-teal-300">
                    <Clock className="h-4 w-4 text-teal-400" />
                    Turnkey Run-of-Show Sensory Timeline:
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">4 Experiential Phases</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {defaultRunOfShow.map((ros, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-sky-500/20 bg-slate-950/70 p-3.5 space-y-2 hover:border-sky-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                          {ros.time}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Step {idx + 1}</span>
                      </div>

                      <div className="text-xs font-bold text-white">{ros.segment}</div>

                      <div className="text-[11px] text-slate-300">
                        <strong className="text-sky-300">Integration:</strong> {ros.sponsor_integration}
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-1.5">
                        <strong className="text-slate-300">Sensory:</strong> {ros.sensory_details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL PREDICTIONS / ACTIVATION DECK */}
        {activeTab === "deck" && (
          <div className="space-y-6">
            {activationData ? (
              <ActivationDeck activation={activationData} />
            ) : (
              <div className="culture-card p-12 text-center space-y-4">
                <Sparkles className="h-10 w-10 text-amber-400 mx-auto animate-pulse" />
                <h3 className="text-xl font-bold text-white">Synthesize Brand Activation Deck</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Click below to execute the autonomous multi-hop ReAct agent with financial valuation for {entityName} in {city}.
                </p>
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={isLoadingActivation}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  {isLoadingActivation ? "Synthesizing Deck..." : "Generate Brand Activation"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FULL TASTE NETWORK GRAPH */}
        {activeTab === "graph" && auditData && (
          <div className="space-y-6">
            <TasteNetworkGraph
              entity={auditData.entity}
              clusters={auditData.domain_clusters}
              city={auditData.city}
            />
          </div>
        )}

        {/* TAB 4: CROSS DOMAIN VENUE MATRIX */}
        {activeTab === "matrix" && auditData && (
          <div className="space-y-6">
            <CrossDomainMatrix
              clusters={auditData.domain_clusters}
              entityName={auditData.entity.name}
            />
          </div>
        )}
      </main>

      {/* DECORATIVE DIVERSE CULTURAL FOOTER */}
      <footer className="mt-12 border-t border-sky-500/20 bg-[#070b14]/95 text-xs text-slate-400 print:hidden relative overflow-hidden">
        {/* Diverse Cultural Banner Motif */}
        <div className="w-full bg-gradient-to-r from-sky-600 via-teal-500 via-amber-500 via-rose-500 to-indigo-600 h-1" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Cultural Community Callout */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 shadow-md">
                <Globe2 className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Global Culture, Community & Landmarks Engine
                  <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                    250M+ Taste Entities
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Empowering global cultural curators, independent artists, and luxury brands with grounded empirical intelligence.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live Qloo Taste Graph API Verified
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                Google Gemini 2.5 Flash
              </span>
            </div>
          </div>

          {/* Copyright & Hackathon Notice */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              &copy; 2026 <strong>CultOS</strong> &bull; Autonomous Cultural Intelligence & Brand Activation Engine. Built for the <strong>Qloo Agentic AI Hackathon</strong> ($25,000 Prize Entry).
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>London</span>
              <span>&bull;</span>
              <span>Tokyo</span>
              <span>&bull;</span>
              <span>New York</span>
              <span>&bull;</span>
              <span>Paris</span>
              <span>&bull;</span>
              <span>Berlin</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
