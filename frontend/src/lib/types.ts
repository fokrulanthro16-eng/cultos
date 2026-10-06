export interface EntityProfile {
  id: string;
  name: string;
  category: string;
  subgenres: string[];
  cultural_archetype: string;
  bio: string;
}

export interface AffinityEntity {
  id: string;
  name: string;
  domain: string;
  affinity_score: number;
  rationale: string;
  tags: string[];
  city_specific?: string;
}

export interface DomainAffinityCluster {
  domain: string;
  display_title: string;
  summary: string;
  entities: AffinityEntity[];
}

export interface BlindspotItem {
  domain: string;
  vanilla_hallucination: string;
  vanilla_flaw: string;
  vanilla_tag: string;
  grounded_entity: string;
  grounded_rationale: string;
  affinity_score: number;
  qloo_verified: boolean;
}

export interface BrandSafetyFlag {
  brand_name: string;
  domain: string;
  hallucinated_by: string;
  disconnect_percentage: number;
  risk_level: string; // CRITICAL, HIGH, MODERATE
  toxicity_category: string;
  rejection_rationale: string;
  safe_substitute: string;
}

export interface AuditResponse {
  entity: EntityProfile;
  city: string;
  target_audience: string;
  cultural_congruence_index: number;
  blindspots: BlindspotItem[];
  brand_safety_flags: BrandSafetyFlag[];
  domain_clusters: DomainAffinityCluster[];
  source: string;
  status: string;
  generated_at: string;
}

export interface ReActHop {
  step_number: number;
  step_name: string;
  thought: string;
  action: string;
  observation: string;
  status: string;
}

export interface FinancialValuation {
  total_estimated_budget_usd: number;
  total_sponsorship_yield_usd: number;
  projected_audience_reach: number;
  projected_impressions: number;
  estimated_emv_multiplier: number;
  roi_projection: string;
}

export interface BrandSponsor {
  brand_name: string;
  domain: string;
  affinity_score: number;
  sponsorship_tier: string;
  estimated_value_usd: number;
  audience_overlap_pct: number;
  activation_concept: string;
  audience_overlap_rationale: string;
}

export interface CulinaryItem {
  category: string;
  item_name: string;
  partner_or_purveyor: string;
  cultural_link: string;
}

export interface RunOfShowItem {
  time: string;
  segment: string;
  touchpoint: string;
  sponsor_integration: string;
  sensory_details: string;
}

export interface ActivationResponse {
  campaign_id: string;
  title: string;
  creative_theme: string;
  manifesto: string;
  entity_name: string;
  city: string;
  target_audience: string;
  budget_tier: string;
  cultural_congruence_index: number;
  financial_valuation: FinancialValuation;
  brand_safety_airlock: BrandSafetyFlag[];
  reasoning_hops: ReActHop[];
  sponsors: BrandSponsor[];
  culinary_program: CulinaryItem[];
  run_of_show: RunOfShowItem[];
  experiential_highlights: string[];
  kpis: string[];
  executive_summary: string;
  source: string;
  status: string;
  generated_at: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  qloo_api_configured: boolean;
  gemini_api_configured: boolean;
  environment: string;
}

export interface AuditRequestPayload {
  entity_name: string;
  city: string;
  target_audience: string;
  category?: string;
}

export interface ActivationRequestPayload {
  entity_name: string;
  city: string;
  target_audience: string;
  budget_tier: string;
  custom_notes?: string;
}
