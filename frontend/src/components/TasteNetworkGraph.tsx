"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Compass, Filter, Share2, Layers, Info } from "lucide-react";
import { DomainAffinityCluster, EntityProfile } from "@/lib/types";

interface TasteNetworkGraphProps {
  entity: EntityProfile;
  clusters: DomainAffinityCluster[];
  city: string;
}

interface Node {
  id: string;
  name: string;
  domain: "artist" | "subculture" | "fashion" | "dining" | "nightlife" | "places";
  score?: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  stroke: string;
  glow: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
  domain: string;
}

export default function TasteNetworkGraph({
  entity,
  clusters,
  city,
}: TasteNetworkGraphProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Compute graph coordinates
  const { nodes, edges } = useMemo(() => {
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const nList: Node[] = [];
    const eList: Edge[] = [];

    // Central Node: Artist
    nList.push({
      id: "center_artist",
      name: entity.name,
      domain: "artist",
      score: 100,
      x: centerX,
      y: centerY,
      radius: 36,
      color: "#8b5cf6",
      stroke: "#c084fc",
      glow: "rgba(139, 92, 246, 0.6)",
    });

    // Ring 1: Subcultures (Radius ~ 130px)
    const subgenres = entity.subgenres.slice(0, 4);
    const subCount = subgenres.length || 3;
    subgenres.forEach((genre, idx) => {
      const angle = (idx / subCount) * 2 * Math.PI - Math.PI / 2;
      const r = 135;
      const sId = `sub_${idx}`;
      nList.push({
        id: sId,
        name: genre,
        domain: "subculture",
        score: 98,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        radius: 20,
        color: "#6366f1",
        stroke: "#818cf8",
        glow: "rgba(99, 102, 241, 0.4)",
      });
      eList.push({
        source: "center_artist",
        target: sId,
        weight: 98,
        domain: "subculture",
      });
    });

    // Ring 2: Domain Entities (Radius ~ 230px)
    const flatEntities: { domain: string; name: string; score: number }[] = [];
    clusters.forEach((c) => {
      c.entities.slice(0, 3).forEach((e) => {
        flatEntities.push({
          domain: c.domain,
          name: e.name,
          score: e.affinity_score,
        });
      });
    });

    const domainColors: Record<string, { fill: string; stroke: string; glow: string }> = {
      fashion: { fill: "#10b981", stroke: "#34d399", glow: "rgba(16, 185, 129, 0.4)" },
      dining: { fill: "#f59e0b", stroke: "#fbbf24", glow: "rgba(245, 158, 11, 0.4)" },
      nightlife: { fill: "#06b6d4", stroke: "#22d3ee", glow: "rgba(6, 182, 212, 0.4)" },
      places: { fill: "#f43f5e", stroke: "#fb7185", glow: "rgba(244, 63, 94, 0.4)" },
    };

    const entCount = flatEntities.length || 8;
    flatEntities.forEach((ent, idx) => {
      const angle = (idx / entCount) * 2 * Math.PI - Math.PI / 4;
      const r = 230;
      const cPalette = domainColors[ent.domain] || {
        fill: "#a855f7",
        stroke: "#c084fc",
        glow: "rgba(168, 85, 247, 0.4)",
      };
      const eId = `ent_${ent.domain}_${idx}`;
      nList.push({
        id: eId,
        name: ent.name,
        domain: ent.domain as any,
        score: ent.score,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        radius: 16,
        color: cPalette.fill,
        stroke: cPalette.stroke,
        glow: cPalette.glow,
      });

      // Connect to a nearest subculture or artist
      const targetSub = `sub_${idx % subCount}`;
      eList.push({
        source: targetSub,
        target: eId,
        weight: ent.score,
        domain: ent.domain,
      });
    });

    return { nodes: nList, edges: eList };
  }, [entity, clusters]);

  // Filter nodes & edges
  const filteredNodes = useMemo(() => {
    if (selectedDomain === "all") return nodes;
    return nodes.filter(
      (n) => n.domain === "artist" || n.domain === "subculture" || n.domain === selectedDomain
    );
  }, [nodes, selectedDomain]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [edges, filteredNodes]);

  return (
    <div className="w-full space-y-4 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Cultural Node Graph
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            Taste Geometry for {entity.name} &bull; {city}
          </h3>
          <p className="text-xs text-zinc-400">
            Multi-hop relational taste vectors extracted from 250M+ entities in Qloo&apos;s Taste Graph.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "fashion", "dining", "nightlife", "places"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDomain(d)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-all ${
                selectedDomain === d
                  ? "bg-purple-600 text-white shadow-glow-purple"
                  : "bg-zinc-900 text-zinc-400 border border-white/[0.05] hover:text-zinc-200"
              }`}
            >
              {d === "all" ? "All Domains" : d}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c10] flex items-center justify-center">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto max-h-[520px] select-none"
        >
          <defs>
            {/* Globe Sphere Gradient */}
            <radialGradient id="globeShading" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#0f172a" stopOpacity="1" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* Atmosphere Halo */}
            <radialGradient id="atmosphereHalo" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            {/* Pulse Line Animation Gradient */}
            <linearGradient id="vectorPulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>

            {/* Globe Grid Pattern Filter */}
            <filter id="globeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Radial Grid lines & Celestial Coordinates */}
          <circle cx="400" cy="250" r="135" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="4 4" />
          <circle cx="400" cy="250" r="230" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeDasharray="6 6" />

          {/* Background Orbit Ring */}
          <ellipse
            cx="400"
            cy="250"
            rx="270"
            ry="90"
            fill="none"
            stroke="rgba(6, 182, 212, 0.08)"
            strokeDasharray="5 5"
            transform="rotate(-15 400 250)"
          />

          {/* Edges with Animated Pulsing Vector Lines */}
          {filteredEdges.map((edge, i) => {
            const sNode = nodes.find((n) => n.id === edge.source);
            const tNode = nodes.find((n) => n.id === edge.target);
            if (!sNode || !tNode) return null;

            const isHighlighted =
              hoveredNode &&
              (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

            return (
              <g key={`edge-${i}`}>
                {/* Base Line */}
                <line
                  x1={sNode.x}
                  y1={sNode.y}
                  x2={tNode.x}
                  y2={tNode.y}
                  stroke={isHighlighted ? "#38bdf8" : "rgba(255,255,255,0.14)"}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={edge.domain === "subculture" ? "none" : "4 4"}
                  className="transition-all duration-300"
                />

                {/* Animated Glowing Vector Pulse */}
                <line
                  x1={sNode.x}
                  y1={sNode.y}
                  x2={tNode.x}
                  y2={tNode.y}
                  stroke="url(#vectorPulse)"
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeDasharray="8 16"
                  opacity={isHighlighted ? 0.9 : 0.45}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="24"
                    to="0"
                    dur={isHighlighted ? "1s" : "2.5s"}
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}

          {/* Nodes (excluding center artist which is rendered as the stylized 3D globe) */}
          {filteredNodes
            .filter((n) => n.domain !== "artist")
            .map((node) => {
              const isHovered = hoveredNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Glow ring */}
                  <circle
                    r={node.radius + (isHovered ? 8 : 4)}
                    fill={node.glow}
                    className="transition-all duration-300"
                  />

                  {/* Main Circle */}
                  <circle
                    r={node.radius}
                    fill={node.color}
                    stroke={node.stroke}
                    strokeWidth={isHovered ? 3 : 1.5}
                    className="transition-all duration-200"
                  />

                  {/* Node Label */}
                  <text
                    dy={node.radius + 14}
                    textAnchor="middle"
                    fill={isHovered ? "#ffffff" : "#cbd5e1"}
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none drop-shadow"
                  >
                    {node.name.length > 18 ? node.name.slice(0, 16) + "…" : node.name}
                  </text>
                </g>
              );
            })}

          {/* CENTER 3D/SVG WORLD GLOBE NODE (Artist & Cultural Origin) */}
          {(() => {
            const centerNode = nodes.find((n) => n.domain === "artist");
            if (!centerNode) return null;
            const isHovered = hoveredNode?.id === centerNode.id;

            return (
              <g
                transform={`translate(400, 250)`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(centerNode)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Atmosphere Outer Glow Halo */}
                <circle r={64} fill="url(#atmosphereHalo)" />

                {/* Orbit Rings around Globe */}
                <ellipse
                  rx={58}
                  ry={22}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  transform="rotate(-25)"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="-25"
                    to="335"
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </ellipse>
                <ellipse
                  rx={52}
                  ry={16}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth={0.8}
                  strokeOpacity={0.4}
                  transform="rotate(35)"
                />

                {/* 3D Sphere Base */}
                <circle
                  r={44}
                  fill="url(#globeShading)"
                  stroke="#38bdf8"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  filter="url(#globeGlow)"
                  className="transition-all duration-300"
                />

                {/* Globe Longitude Meridiens (Curved 3D Latitude/Longitude) */}
                <ellipse cx="0" cy="0" rx="44" ry="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} />
                <ellipse cx="0" cy="0" rx="30" ry="44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.7} />
                <ellipse cx="0" cy="0" rx="14" ry="44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.7} />
                <line x1="0" y1="-44" x2="0" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />

                {/* Globe Latitude Parallels */}
                <line x1="-44" y1="0" x2="44" y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} strokeDasharray="3 2" />
                <ellipse cx="0" cy="-18" rx="40" ry="10" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />
                <ellipse cx="0" cy="18" rx="40" ry="10" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={0.7} />

                {/* Stylized Continents / Cultural Constellation Points */}
                <circle cx="-16" cy="-10" r="2.5" fill="#facc15" className="animate-ping" style={{ animationDuration: "3s" }} />
                <circle cx="-16" cy="-10" r="2" fill="#fbbf24" />
                <circle cx="12" cy="-14" r="1.8" fill="#34d399" />
                <circle cx="22" cy="8" r="2" fill="#38bdf8" />
                <circle cx="-8" cy="16" r="1.8" fill="#f43f5e" />

                {/* Center Core Brand Badge */}
                <circle r={16} fill="#090d16" stroke="#38bdf8" strokeWidth={1.5} />
                <text
                  textAnchor="middle"
                  dy={4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  ✦
                </text>

                {/* Artist Name & City under Globe */}
                <text
                  dy={60}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md"
                >
                  {centerNode.name}
                </text>
                <text
                  dy={73}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {city.toUpperCase()} CULTURAL HUB
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Hover Info Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-white/[0.1] bg-zinc-950/95 p-3 text-xs shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-bold text-white text-sm">{hoveredNode.name}</span>
              <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] text-purple-300 uppercase">
                {hoveredNode.domain}
              </span>
            </div>
            {hoveredNode.score && (
              <div className="text-[11px] text-emerald-400 font-mono">
                Affinity Index: <strong>{hoveredNode.score.toFixed(1)}%</strong>
              </div>
            )}
            <p className="mt-1 text-[11px] text-zinc-400 leading-snug">
              {hoveredNode.domain === "artist"
                ? `Core cultural anchor for ${city} live activations.`
                : hoveredNode.domain === "subculture"
                ? `Key sonic & aesthetic bridge for this fanbase.`
                : `Empirically correlated ${hoveredNode.domain} node in Qloo Taste Graph.`}
            </p>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400 pt-2 border-t border-white/[0.04]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-glow-purple" />
            <span>Performer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span>Subculture DNA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Fashion Atelier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Gastronomy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            <span>Nightlife / Sanctuaries</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
          <Info className="h-3 w-3" />
          <span>Hover nodes to trace affinity vectors</span>
        </div>
      </div>
    </div>
  );
}
