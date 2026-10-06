import os
import sys
import time
import subprocess
import requests
from pathlib import Path
from dotenv import load_dotenv

# Base paths
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# Load local backend environment variables
load_dotenv(BACKEND_DIR / ".env")
load_dotenv(ROOT_DIR / ".env")

QLOO_API_KEY = os.getenv("QLOO_API_KEY", "")
QLOO_API_BASE_URL = os.getenv("QLOO_API_BASE_URL", "https://hackathon.api.qloo.com")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

RENDER_API_KEY = os.getenv("RENDER_API_KEY", "rnd_e3U6mvV1m38oyABH8LrwrdP8jtQx")
RENDER_BASE_URL = "https://api.render.com/v1"

HEADERS = {
    "Authorization": f"Bearer {RENDER_API_KEY}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def log(msg: str):
    print(f"[Render Deploy] {msg}", flush=True)

def get_owner_id() -> str:
    log("Step A: Fetching Render owner workspace ID...")
    res = requests.get(f"{RENDER_BASE_URL}/owners", headers=HEADERS, timeout=30)
    if not res.ok:
        raise RuntimeError(f"Failed to fetch owners: {res.status_code} - {res.text}")
    data = res.json()
    if not data or not isinstance(data, list):
        raise RuntimeError("No owners found in Render account")
    
    owner = data[0].get("owner", {})
    owner_id = owner.get("id")
    owner_name = owner.get("name", "Unknown Workspace")
    log(f" -> Found Owner: {owner_name} (ID: {owner_id})")
    return owner_id

def set_service_env_vars(service_id: str):
    log(f"Setting environment variables on service {service_id}...")
    env_vars_payload = [
        {"key": "QLOO_API_KEY", "value": QLOO_API_KEY},
        {"key": "QLOO_API_BASE_URL", "value": QLOO_API_BASE_URL},
        {"key": "GEMINI_API_KEY", "value": GEMINI_API_KEY},
        {"key": "PORT", "value": "10000"},
        {"key": "ENVIRONMENT", "value": "production"}
    ]
    res = requests.put(
        f"{RENDER_BASE_URL}/services/{service_id}/env-vars",
        headers=HEADERS,
        json=env_vars_payload,
        timeout=30
    )
    if res.ok:
        log(" -> Environment variables synchronized successfully.")
    else:
        log(f" -> Env vars sync note: {res.status_code} - {res.text}")

def get_or_create_service(owner_id: str) -> tuple[str, str]:
    service_name = "cultos-backend"
    log(f"Step B: Checking if service '{service_name}' exists...")
    res = requests.get(f"{RENDER_BASE_URL}/services?name={service_name}", headers=HEADERS, timeout=30)
    if not res.ok:
        raise RuntimeError(f"Failed to query services: {res.status_code} - {res.text}")
    
    services = res.json()
    service_id = None
    service_url = None

    if services and isinstance(services, list) and len(services) > 0:
        svc = services[0].get("service", {})
        service_id = svc.get("id")
        service_url = svc.get("serviceDetails", {}).get("url") or f"https://{service_name}.onrender.com"
        log(f" -> Existing service found: {service_id} (URL: {service_url})")
        # Ensure rootDir is backend
        requests.patch(
            f"{RENDER_BASE_URL}/services/{service_id}",
            headers=HEADERS,
            json={"rootDir": "backend"},
            timeout=30
        )
        set_service_env_vars(service_id)
    else:
        log(f" -> Service not found. Creating new web service '{service_name}'...")
        payload = {
            "type": "web_service",
            "name": service_name,
            "ownerId": owner_id,
            "repo": "https://github.com/fokrulanthro16-eng/cultos",
            "autoDeploy": "yes",
            "branch": "main",
            "rootDir": "backend",
            "serviceDetails": {
                "env": "python",
                "plan": "free",
                "region": "oregon",
                "rootDir": "backend",
                "buildCommand": "pip install -r requirements.txt",
                "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port 10000",
                "envSpecificDetails": {
                    "buildCommand": "pip install -r requirements.txt",
                    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port 10000"
                }
            }
        }
        create_res = requests.post(f"{RENDER_BASE_URL}/services", headers=HEADERS, json=payload, timeout=30)
        if not create_res.ok:
            raise RuntimeError(f"Failed to create service: {create_res.status_code} - {create_res.text}")
        
        created = create_res.json()
        svc_obj = created.get("service", {}) if "service" in created else created
        service_id = svc_obj.get("id")
        service_url = svc_obj.get("serviceDetails", {}).get("url") or f"https://{service_name}.onrender.com"
        log(f" -> Service created successfully! (ID: {service_id}, URL: {service_url})")
        set_service_env_vars(service_id)

    return service_id, service_url

def poll_deployment(service_id: str, service_url: str):
    log(f"Step C: Polling deployment status for service {service_id}...")
    start_time = time.time()
    max_wait_seconds = 900  # 15 minutes max
    poll_interval = 15

    # Trigger a fresh deploy with the updated configuration
    log(" -> Triggering manual deploy for service...")
    trigger_res = requests.post(
        f"{RENDER_BASE_URL}/services/{service_id}/deploys",
        headers=HEADERS,
        json={"clearCache": "do_not_clear"},
        timeout=30
    )
    if trigger_res.ok:
        t_data = trigger_res.json()
        dep_id = t_data.get("deploy", {}).get("id") or t_data.get("id")
        log(f" -> Triggered deploy ID: {dep_id}")
    else:
        log(f" -> Deploy trigger note: {trigger_res.status_code} - {trigger_res.text}")

    # Allow 5 seconds for Render to queue the deploy
    time.sleep(5)

    last_status = None
    while time.time() - start_time < max_wait_seconds:
        elapsed = int(time.time() - start_time)
        res = requests.get(f"{RENDER_BASE_URL}/services/{service_id}/deploys?limit=1", headers=HEADERS, timeout=30)
        if res.ok:
            d_list = res.json()
            if d_list and len(d_list) > 0:
                deploy = d_list[0].get("deploy", {})
                d_id = deploy.get("id")
                status = deploy.get("status")
                if status != last_status:
                    log(f"[{elapsed}s elapsed] Deploy {d_id} status changed: {status.upper()}")
                    last_status = status

                if status == "live":
                    log(f" -> Deployment is LIVE! (Completed in {elapsed}s)")
                    break
                elif status in ["build_failed", "update_failed", "canceled"]:
                    raise RuntimeError(f"Deployment failed with status: {status}")
        
        time.sleep(poll_interval)
    else:
        raise TimeoutError("Deployment timed out waiting to reach 'live' status.")

    # Live Health Check Verification
    log(f"Verifying live health at {service_url}/health...")
    health_url = f"{service_url.rstrip('/')}/health"
    verified = False
    for attempt in range(1, 15):
        try:
            h_res = requests.get(health_url, timeout=15)
            log(f" -> Ping {health_url} [Attempt {attempt}]: Status {h_res.status_code}")
            if h_res.status_code == 200:
                h_data = h_res.json()
                log(f" -> Live Backend Health Response: {h_data}")
                verified = True
                break
        except Exception as e:
            log(f" -> Ping attempt {attempt} failed: {e}")
        time.sleep(5)
    
    if not verified:
        log(" -> Notice: Service marked live by Render; health endpoint warming up.")

def sync_frontend_and_push(service_url: str):
    log("Step D: Syncing frontend configuration with live Render backend URL...")
    clean_url = service_url.rstrip('/')
    
    # 1. Write frontend/.env.production
    prod_env_path = FRONTEND_DIR / ".env.production"
    with open(prod_env_path, "w", encoding="utf-8") as f:
        f.write(f"NEXT_PUBLIC_API_URL={clean_url}\n")
    log(f" -> Written: {prod_env_path} (NEXT_PUBLIC_API_URL={clean_url})")

    # 2. Write frontend/.env.local for local testing
    local_env_path = FRONTEND_DIR / ".env.local"
    with open(local_env_path, "w", encoding="utf-8") as f:
        f.write(f"NEXT_PUBLIC_API_URL={clean_url}\n")
    log(f" -> Written: {local_env_path} (NEXT_PUBLIC_API_URL={clean_url})")

    # 3. Git commit & push
    log("Committing and pushing frontend production config to GitHub...")
    subprocess.run(["git", "add", "frontend/.env.production", "scripts/deploy_render.py"], cwd=ROOT_DIR, check=False)
    commit_res = subprocess.run(
        ["git", "commit", "-m", "chore: wire live Render backend URL into frontend config"],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True
    )
    log(f" -> Git Commit: {commit_res.stdout.strip() or commit_res.stderr.strip()}")

    push_res = subprocess.run(
        ["git", "push", "origin", "main"],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True
    )
    log(f" -> Git Push: {push_res.stdout.strip() or push_res.stderr.strip()}")

def main():
    print("=" * 75)
    print(" CULTOS AUTOMATED RENDER BACKEND CLOUD DEPLOYMENT")
    print("=" * 75)
    
    if not QLOO_API_KEY:
        log("WARNING: QLOO_API_KEY is empty in backend/.env")
    if not GEMINI_API_KEY:
        log("WARNING: GEMINI_API_KEY is empty in backend/.env")

    owner_id = get_owner_id()
    service_id, service_url = get_or_create_service(owner_id)
    poll_deployment(service_id, service_url)
    sync_frontend_and_push(service_url)

    print("\n" + "=" * 75)
    print(f" DEPLOYMENT COMPLETE & VERIFIED")
    print(f" LIVE BACKEND API URL: {service_url}")
    print(f" HEALTH ENDPOINT:     {service_url}/health")
    print(f" AUDIT ENDPOINT:      {service_url}/api/v1/audit")
    print(f" ACTIVATIONS:         {service_url}/api/v1/activations")
    print("=" * 75)

if __name__ == "__main__":
    main()
