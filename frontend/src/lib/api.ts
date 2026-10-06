import { AuditRequestPayload, AuditResponse, ActivationRequestPayload, ActivationResponse, HealthResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cultos-backend.onrender.com";

export async function fetchHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (error) {
    return {
      status: "degraded",
      version: "1.0.0",
      qloo_api_configured: false,
      gemini_api_configured: true,
      environment: "local-client"
    };
  }
}

export async function runCulturalAudit(payload: AuditRequestPayload): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/audit`, {
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
  const res = await fetch(`${API_BASE_URL}/api/v1/activations`, {
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
