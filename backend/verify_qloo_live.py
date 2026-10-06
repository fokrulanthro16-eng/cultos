"""Live Qloo Hackathon API Sanity Verification Script.
Calls the live Qloo Hackathon API endpoints with official hackathon credentials
and demonstrates end-to-end connectivity.
"""

import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("QLOO_API_KEY", "")
BASE_URL = os.getenv("QLOO_API_BASE_URL", "https://hackathon.api.qloo.com")

headers = {
    "X-Api-Key": API_KEY,
    "Accept": "application/json"
}

def verify_live_connection():
    print("=" * 70)
    print(" CULTOS LIVE QLOO HACKATHON API CONNECTIVITY VERIFICATION")
    print("=" * 70)
    print(f"Target Base URL: {BASE_URL}")
    print(f"API Key Masked:  {API_KEY[:8]}...{API_KEY[-4:]}\n")

    with httpx.Client(timeout=10.0) as client:
        # 1. Exact user requested check: GET /v1/entities?query=Khruangbin
        url_v1 = f"{BASE_URL}/v1/entities?query=Khruangbin"
        print(f"[TEST 1] Calling: GET {url_v1}")
        try:
            r1 = client.get(url_v1, headers=headers)
            print(f"         HTTP Status: {r1.status_code} {r1.reason_phrase}")
            print("         Sample Response:")
            try:
                print(json.dumps(r1.json(), indent=2)[:500])
            except Exception:
                print(r1.text[:300])
        except Exception as e:
            print(f"         Error: {e}")

        print("\n" + "-" * 70 + "\n")

        # 2. Live Qloo Taste Graph Search: GET /v2/search?query=Khruangbin
        url_search = f"{BASE_URL}/v2/search?query=Khruangbin"
        print(f"[TEST 2] Calling: GET {url_search}")
        entity_id = None
        try:
            r2 = client.get(url_search, headers=headers)
            print(f"         HTTP Status: {r2.status_code} {r2.reason_phrase}")
            if r2.status_code == 200:
                data = r2.json()
                results = data.get("results", [])
                if results:
                    top = results[0]
                    entity_id = top.get("entity_id")
                    print(f"         Entity Resolved: {top.get('name')}")
                    print(f"         Qloo Entity ID:  {entity_id}")
                    print(f"         Entity Type:     {top.get('type')} / {top.get('subtype')}")
                    print(f"         Popularity:      {top.get('popularity')}")
        except Exception as e:
            print(f"         Error: {e}")

        print("\n" + "-" * 70 + "\n")

        # 3. Live Qloo Taste Graph Insights: GET /v2/insights for Brand/Fashion affinities
        if entity_id:
            url_insights = f"{BASE_URL}/v2/insights?entity_ids={entity_id}&filter.type=urn:entity:brand"
            print(f"[TEST 3] Calling: GET {url_insights}")
            try:
                r3 = client.get(url_insights, headers=headers)
                print(f"         HTTP Status: {r3.status_code} {r3.reason_phrase}")
                if r3.status_code == 200:
                    insights_data = r3.json()
                    brands = [e.get("name") for e in insights_data.get("results", {}).get("entities", [])[:5]]
                    print(f"         Correlated Taste Brands: {brands}")
            except Exception as e:
                print(f"         Error: {e}")

    print("\n" + "=" * 70)
    print(" VERIFICATION COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    verify_live_connection()
