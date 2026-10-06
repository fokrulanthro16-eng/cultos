"""Main FastAPI Application Entrypoint for CultOS.
Autonomous Cultural Intelligence & Brand Activation Engine.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import HealthResponse
from app.api.audit import router as audit_router
from app.api.activations import router as activations_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cult_os")

app = FastAPI(
    title="CultOS: Autonomous Cultural Intelligence Engine",
    description=(
        "Bridges the fatal blind spot in modern LLMs by grounding generative reasoning "
        "in Qloo's 250M+ entity Taste Graph API."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Registry
app.include_router(audit_router)
app.include_router(activations_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "engine": "CultOS",
        "tagline": "Autonomous Cultural Intelligence & Brand Activation Engine",
        "version": "1.0.0",
        "documentation": "/docs",
        "qloo_api_configured": settings.has_qloo_key,
        "gemini_configured": bool(settings.effective_gemini_key),
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        qloo_api_configured=settings.has_qloo_key,
        gemini_api_configured=bool(settings.effective_gemini_key),
        environment=settings.ENV
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=(settings.ENV == "development")
    )
