from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


# ============================================================================
# Request Schemas
# ============================================================================

class AuditRequest(BaseModel):
    entity_name: str = Field(..., description="Artist, performer, or brand to audit", example="Khruangbin")
    city: str = Field(default="London", description="Target activation city", example="London")
    target_audience: str = Field(
        default="Audiophile Creatives & Festival VIPs",
        description="Target demographic / cultural sub-segment",
        example="Audiophile Creatives & Festival VIPs"
    )
    category: str = Field(default="music", description="Entity category in Qloo graph", example="music")


class ActivationRequest(BaseModel):
    entity_name: str = Field(..., description="Artist, performer, or brand name", example="Khruangbin")
    city: str = Field(default="London", description="Target market city", example="London")
    target_audience: str = Field(
        default="Audiophile Creatives & Festival VIPs",
        description="Target demographic / cultural sub-segment"
    )
    budget_tier: str = Field(
        default="luxury",
        description="Budget scale: boutique, mid-tier, luxury, mega-festival",
        example="luxury"
    )
    custom_notes: Optional[str] = Field(
        default="",
        description="Optional curator specifications or brand directives"
    )


# ============================================================================
# Graph & Affinity Schemas
# ============================================================================

class EntityProfile(BaseModel):
    id: str
    name: str
    category: str
    subgenres: List[str] = []
    cultural_archetype: str = ""
    bio: str = ""


class AffinityEntity(BaseModel):
    id: str
    name: str
    domain: str  # fashion, dining, nightlife, places, spirits
    affinity_score: float = Field(..., description="Correlated taste affinity index 0.0 - 100.0")
    rationale: str
    tags: List[str] = []
    city_specific: Optional[str] = None


class DomainAffinityCluster(BaseModel):
    domain: str  # fashion, dining, nightlife, places
    display_title: str
    summary: str
    entities: List[AffinityEntity]


# ============================================================================
# Blindspot Comparator & Brand Safety Schemas
# ============================================================================

class BlindspotItem(BaseModel):
    domain: str
    vanilla_hallucination: str
    vanilla_flaw: str
    vanilla_tag: str  # e.g., "Generic Commercial Cliché", "Demographic Stereotype", "Vibe Mismatch"
    grounded_entity: str
    grounded_rationale: str
    affinity_score: float
    qloo_verified: bool = True


class BrandSafetyFlag(BaseModel):
    brand_name: str
    domain: str
    hallucinated_by: str = "Vanilla LLM"
    disconnect_percentage: float = 85.0
    risk_level: str = "CRITICAL"  # "MODERATE", "HIGH", "CRITICAL"
    toxicity_category: str  # "Fast-Fashion Cliché", "Commercial Greenwashing", "Generic Vibe Collision", "Sponsor Backlash Risk"
    rejection_rationale: str
    safe_substitute: str


class AuditResponse(BaseModel):
    entity: EntityProfile
    city: str
    target_audience: str
    cultural_congruence_index: float = Field(..., description="Overall taste alignment accuracy vs generic LLM (0-100)")
    blindspots: List[BlindspotItem]
    brand_safety_flags: List[BrandSafetyFlag] = []
    domain_clusters: List[DomainAffinityCluster]
    source: str = Field(..., description="'live_qloo' or 'curated_graph_fixture'")
    status: str = "success"
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# ============================================================================
# ReAct Reasoning Hop Schema
# ============================================================================

class ReActHop(BaseModel):
    step_number: int
    step_name: str
    thought: str
    action: str
    observation: str
    status: str = "completed"


# ============================================================================
# Financial Valuation Engine Schemas
# ============================================================================

class FinancialValuation(BaseModel):
    total_estimated_budget_usd: int
    total_sponsorship_yield_usd: int
    projected_audience_reach: int
    projected_impressions: int
    estimated_emv_multiplier: float  # e.g. 3.6x
    roi_projection: str


class BrandSponsor(BaseModel):
    brand_name: str
    domain: str
    affinity_score: float
    sponsorship_tier: str  # Title Sponsor, Acoustic Stage Partner, Official Capsule Partner, Curated Pour
    estimated_value_usd: int = 150000
    audience_overlap_pct: float = 94.0
    activation_concept: str
    audience_overlap_rationale: str


class CulinaryItem(BaseModel):
    category: str  # Signature Libation, Tasting Bite, Sensory Pairing, Late Night Curation
    item_name: str
    partner_or_purveyor: str
    cultural_link: str


class RunOfShowItem(BaseModel):
    time: str
    segment: str
    touchpoint: str
    sponsor_integration: str
    sensory_details: str


class ActivationResponse(BaseModel):
    campaign_id: str
    title: str
    creative_theme: str
    manifesto: str
    entity_name: str
    city: str
    target_audience: str
    budget_tier: str
    cultural_congruence_index: float
    financial_valuation: FinancialValuation
    brand_safety_airlock: List[BrandSafetyFlag] = []
    reasoning_hops: List[ReActHop] = []
    sponsors: List[BrandSponsor]
    culinary_program: List[CulinaryItem]
    run_of_show: List[RunOfShowItem]
    experiential_highlights: List[str]
    kpis: List[str]
    executive_summary: str
    source: str
    status: str = "success"
    generated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


class HealthResponse(BaseModel):
    status: str
    version: str
    qloo_api_configured: bool
    gemini_api_configured: bool
    environment: str
