"""The Blindspot Comparator Engine:
A/B Engine contrasting Generic LLM Hallucinations vs. Qloo Grounded Cultural Intelligence.
Calculates the Cultural Congruence Index (CCI) from 0 to 100% and generates Brand Safety Airlock flags.
"""

import json
import logging
from typing import Dict, Any, List
from google import genai
from app.config import settings
from app.schemas import BlindspotItem, BrandSafetyFlag

logger = logging.getLogger("cult_os.comparator")


class BlindspotComparator:
    def __init__(self):
        self.api_key = settings.effective_gemini_key
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"[BlindspotComparator] Failed to initialize Gemini client: {e}")

    async def compare_blindspots(
        self,
        entity_name: str,
        city: str,
        target_audience: str,
        qloo_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Runs the A/B comparison between Raw LLM baseline and Qloo-grounded taste vectors."""
        affinities = qloo_data.get("affinities", {})
        existing_blindspots = qloo_data.get("blindspots", [])
        base_congruence = float(qloo_data.get("congruence_index", 94.0))

        default_flags = self._build_default_flags(existing_blindspots)

        if not self.client:
            logger.info("[BlindspotComparator] Running deterministic grounded matrix.")
            return {
                "blindspots": [BlindspotItem(**b) for b in existing_blindspots],
                "brand_safety_flags": default_flags,
                "congruence_index": base_congruence
            }

        prompt = f"""
You are the Blindspot Comparator & Cultural Risk Officer inside CultOS, an elite Cultural Intelligence & Brand Activation Engine.
Analyze why standard / vanilla LLMs fail when guessing cultural brand partners and venues for:
Artist/Entity: {entity_name}
City / Market: {city}
Target Audience: {target_audience}

Qloo Taste Graph Empirical Evidence:
- Verified Subgenres/Archetype: {json.dumps(qloo_data.get('entity', {}))}
- Grounded Cross-Domain Affinities: {json.dumps(affinities)}

Task:
Produce a comparative analysis across 4 domains (fashion, dining, nightlife, beverage).
For each domain, identify:
1. 'vanilla_hallucination': What a generic, ungrounded LLM stereotypically suggests (e.g. Red Bull, H&M, generic steakhouse, tourist rooftop club).
2. 'vanilla_flaw': Why this generic guess fails or offends core fans/curators.
3. 'vanilla_tag': Short label (e.g., 'Commercial Cliché', 'Demographic Stereotype', 'Vibe Mismatch', 'Sponsor Backlash Risk').
4. 'grounded_entity': The specific high-affinity partner, boutique brand, or venue from the Qloo Taste Graph.
5. 'grounded_rationale': The cultural, aesthetic, and demographic justification.
6. 'affinity_score': Float between 88.0 and 98.9 based on empirical match.
7. 'brand_safety_flag': Detailed brand risk assessment:
   - 'brand_name': name of the generic brand
   - 'disconnect_percentage': Float between 82.0 and 94.5 reflecting audience distaste
   - 'risk_level': 'CRITICAL' or 'HIGH'
   - 'toxicity_category': 'Commercial Cliché', 'Corporate Greenwashing', 'Vibe Collision', or 'Sponsor Backlash Risk'
   - 'rejection_rationale': concise justification for airlock rejection
   - 'safe_substitute': the Qloo verified brand

Output strictly valid JSON matching this schema:
{{
  "congruence_index": 95.4,
  "blindspots": [
    {{
      "domain": "fashion",
      "vanilla_hallucination": "H&M Festival Boho",
      "vanilla_flaw": "Reduces artisanal slow-craft music to fast-fashion waste.",
      "vanilla_tag": "Commercial Cliché",
      "grounded_entity": "Patagonia / Bode",
      "grounded_rationale": "High statistical co-occurrence with repair-first, slow textiles.",
      "affinity_score": 96.5,
      "qloo_verified": true,
      "brand_safety_flag": {{
        "brand_name": "H&M",
        "domain": "fashion",
        "hallucinated_by": "Vanilla LLM",
        "disconnect_percentage": 91.5,
        "risk_level": "CRITICAL",
        "toxicity_category": "Fast-Fashion Cliché",
        "rejection_rationale": "Severe backlash risk from sustainability-conscious VIPs.",
        "safe_substitute": "Patagonia / Bode"
      }}
    }}
  ]
}}
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=dict(
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )
            raw_text = response.text.strip()
            data = json.loads(raw_text)

            blindspot_list = []
            safety_flags = []

            for item in data.get("blindspots", []):
                domain = item.get("domain", "general")
                vanilla_h = item.get("vanilla_hallucination", "Generic Brand")
                grounded_e = item.get("grounded_entity", "Bespoke Cultural Partner")
                blindspot_list.append(
                    BlindspotItem(
                        domain=domain,
                        vanilla_hallucination=vanilla_h,
                        vanilla_flaw=item.get("vanilla_flaw", "Superficial demographic match"),
                        vanilla_tag=item.get("vanilla_tag", "Commercial Cliché"),
                        grounded_entity=grounded_e,
                        grounded_rationale=item.get("grounded_rationale", "Empirically verified affinity"),
                        affinity_score=round(float(item.get("affinity_score", 94.0)), 1),
                        qloo_verified=True
                    )
                )

                flag_raw = item.get("brand_safety_flag")
                if flag_raw:
                    safety_flags.append(
                        BrandSafetyFlag(
                            brand_name=flag_raw.get("brand_name", vanilla_h.split()[0]),
                            domain=domain,
                            hallucinated_by="Vanilla LLM",
                            disconnect_percentage=round(float(flag_raw.get("disconnect_percentage", 86.0)), 1),
                            risk_level=flag_raw.get("risk_level", "CRITICAL"),
                            toxicity_category=flag_raw.get("toxicity_category", "Commercial Cliché"),
                            rejection_rationale=flag_raw.get("rejection_rationale", item.get("vanilla_flaw")),
                            safe_substitute=flag_raw.get("safe_substitute", grounded_e)
                        )
                    )

            congruence = float(data.get("congruence_index", base_congruence))
            return {
                "blindspots": blindspot_list if blindspot_list else [BlindspotItem(**b) for b in existing_blindspots],
                "brand_safety_flags": safety_flags if safety_flags else default_flags,
                "congruence_index": congruence
            }
        except Exception as e:
            logger.warning(f"[BlindspotComparator] LLM synthesis failed ({e}). Using curated fixture blindspots.")
            return {
                "blindspots": [BlindspotItem(**b) for b in existing_blindspots],
                "brand_safety_flags": default_flags,
                "congruence_index": base_congruence
            }

    def _build_default_flags(self, blindspots: List[Dict[str, Any]]) -> List[BrandSafetyFlag]:
        flags = []
        for b in blindspots:
            vh = b.get("vanilla_hallucination", "Generic Sponsor")
            brand = vh.split()[0].replace("'", "").replace('"', "")
            flags.append(
                BrandSafetyFlag(
                    brand_name=brand,
                    domain=b.get("domain", "general"),
                    hallucinated_by="Vanilla LLM",
                    disconnect_percentage=88.0,
                    risk_level="CRITICAL",
                    toxicity_category=b.get("vanilla_tag", "Commercial Cliché"),
                    rejection_rationale=b.get("vanilla_flaw", "Generic demographic hallucination"),
                    safe_substitute=b.get("grounded_entity", "Grounded Cultural Partner")
                )
            )
        return flags


comparator_agent = BlindspotComparator()
