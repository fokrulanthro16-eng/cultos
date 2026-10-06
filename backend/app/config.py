from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    QLOO_API_KEY: str = ""
    QLOO_API_BASE_URL: str = "https://hackathon.api.qloo.com"
    QLOO_BASE_URL: Optional[str] = None
    GEMINI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    ENVIRONMENT: str = "development"
    ENV: Optional[str] = None
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @property
    def effective_qloo_base_url(self) -> str:
        url = self.QLOO_API_BASE_URL or self.QLOO_BASE_URL or "https://hackathon.api.qloo.com"
        return url.strip().rstrip("/")

    @property
    def effective_gemini_key(self) -> str:
        return self.GEMINI_API_KEY or self.GOOGLE_API_KEY or os.environ.get("GEMINI_API_KEY", "") or os.environ.get("GOOGLE_API_KEY", "")

    @property
    def has_qloo_key(self) -> bool:
        return bool(self.QLOO_API_KEY and self.QLOO_API_KEY.strip() != "your_qloo_api_key_here")

    @property
    def effective_env(self) -> str:
        return self.ENVIRONMENT or self.ENV or "development"


settings = Settings()
