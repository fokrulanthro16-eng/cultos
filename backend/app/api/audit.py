"""Audit API endpoint: Generates cultural taste profiles and A/B Blindspot matrix."""

import logging
from fastapi import APIRouter, HTTPException
from app.schemas import AuditRequest, AuditResponse, DomainAffinityCluster, AffinityEntity, EntityProfile
from app.qloo.client import qloo_client
from app.agent.comparator import comparator_agent

logger = logging.getLogger("cult_os.api.audit")
router = APIRouter(prefix="/api/v1", tags=["Taste Audit"])


@router.post("/audit", response_model=AuditResponse)
async def perform_cultural_audit(request: AuditRequest):
    """Profiles an artist or brand in the target city and produces the A/B Blindspot matrix
    contrasting vanilla LLM stereotypes against empirical Qloo Taste Graph vectors.
    """
    try:
        # Step 1: Retrieve taste profile from Qloo client (live with fallback)
        qloo_profile = await qloo_client.get_full_taste_profile(
            entity_name=request.entity_name,
            city=request.city,
            target_audience=request.target_audience
        )

        # Step 2: Run Blindspot Comparator Agent (A/B evaluation + Brand Safety Airlock)
        comparison = await comparator_agent.compare_blindspots(
            entity_name=request.entity_name,
            city=request.city,
            target_audience=request.target_audience,
            qloo_data=qloo_profile
        )

        # Step 3: Format domain affinity clusters
        raw_affinities = qloo_profile.get("affinities", {})
        domain_clusters = []
        domain_labels = {
            "fashion": "Archival & Atelier Fashion",
            "dining": "Low-Intervention & Gastronomy",
            "nightlife": "High-Fidelity Nightlife & Venues",
            "places": "Cultural Anchors & Sanctuaries",
            "spirits": "Artisanal Libations & Distillates"
        }

        for domain_key, entities_list in raw_affinities.items():
            cluster_entities = [AffinityEntity(**e) for e in entities_list]
            domain_clusters.append(
                DomainAffinityCluster(
                    domain=domain_key,
                    display_title=domain_labels.get(domain_key, domain_key.title()),
                    summary=f"Top correlated {domain_key} entities based on Qloo 250M+ Taste Graph co-occurrence.",
                    entities=cluster_entities
                )
            )

        raw_entity = qloo_profile.get("entity", {})
        entity_obj = EntityProfile(
            id=raw_entity.get("id", f"ent_{request.entity_name.lower()}"),
            name=raw_entity.get("name", request.entity_name),
            category=raw_entity.get("category", "music"),
            subgenres=raw_entity.get("subgenres", []),
            cultural_archetype=raw_entity.get("cultural_archetype", "Global Tastemaker"),
            bio=raw_entity.get("bio", "")
        )

        return AuditResponse(
            entity=entity_obj,
            city=request.city,
            target_audience=request.target_audience,
            cultural_congruence_index=comparison.get("congruence_index", 95.0),
            blindspots=comparison.get("blindspots", []),
            brand_safety_flags=comparison.get("brand_safety_flags", []),
            domain_clusters=domain_clusters,
            source=qloo_profile.get("source", "curated_graph_fixture"),
            status="success"
        )
    except Exception as e:
        logger.error(f"[AuditEndpoint] Error executing audit: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to execute cultural audit: {str(e)}")
