import { AuditRequestPayload, AuditResponse, ActivationRequestPayload, ActivationResponse, HealthResponse } from "./types";

const DIRECT_API_URL = "https://cultos-backend.onrender.com";

// In browser, default to relative path to use Next.js proxy rewrites without CORS blocks.
// In SSR or non-browser runtime, use the configured backend URL.
const API_BASE_URL = typeof window !== "undefined"
  ? ""
  : (process.env.NEXT_PUBLIC_API_URL || DIRECT_API_URL);

async function requestWithFallback(endpoint: string, init?: RequestInit): Promise<Response> {
  const primaryUrl = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(primaryUrl, init);
    if (res.ok) return res;
    // If the proxy rewrite returned a gateway or proxy error, fallback to direct backend
    if (API_BASE_URL === "") {
      const fallbackUrl = `${DIRECT_API_URL}${endpoint}`;
      const fallbackRes = await fetch(fallbackUrl, init);
      if (fallbackRes.ok) return fallbackRes;
    }
    return res;
  } catch (err) {
    if (API_BASE_URL === "") {
      const fallbackUrl = `${DIRECT_API_URL}${endpoint}`;
      return await fetch(fallbackUrl, init);
    }
    throw err;
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await requestWithFallback("/health", { cache: "no-store" });
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (error) {
    return {
      status: "degraded",
      version: "1.0.0",
      qloo_api_configured: false,
      gemini_api_configured: true,
      environment: "production"
    };
  }
}

export async function runCulturalAudit(payload: AuditRequestPayload): Promise<AuditResponse> {
  const res = await requestWithFallback("/api/v1/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Audit failed (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function generateBrandActivation(payload: ActivationRequestPayload): Promise<ActivationResponse> {
  const res = await requestWithFallback("/api/v1/activations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Activation generation failed (${res.status}): ${errText}`);
  }

  return await res.json();
}
