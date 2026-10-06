"""Activations API endpoint: Synthesizes brand sponsorship proposals and run-of-shows."""

import logging
from fastapi import APIRouter, HTTPException
from app.schemas import ActivationRequest, ActivationResponse
from app.qloo.client import qloo_client
from app.agent.activation_agent import activation_agent

logger = logging.getLogger("cult_os.api.activations")
router = APIRouter(prefix="/api/v1", tags=["Brand Activations"])


@router.post("/activations", response_model=ActivationResponse)
async def generate_brand_activation(request: ActivationRequest):
    """Generates an executive-ready brand activation proposal, complete with Qloo-verified
    sponsors, culinary curation, and sensory run-of-show touchpoints.
    """
    try:
        # Step 1: Ingest entity taste graph from Qloo client
        qloo_profile = await qloo_client.get_full_taste_profile(
            entity_name=request.entity_name,
            city=request.city,
            target_audience=request.target_audience
        )

        # Step 2: Generate proposal using ActivationAgent
        activation = await activation_agent.generate_activation(
            entity_name=request.entity_name,
            city=request.city,
            target_audience=request.target_audience,
            budget_tier=request.budget_tier,
            qloo_data=qloo_profile,
            custom_notes=request.custom_notes or ""
        )

        return activation
    except Exception as e:
        logger.error(f"[ActivationsEndpoint] Error generating activation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate brand activation: {str(e)}")
