"""Application configuration settings for TrustLayer."""

import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Core configuration for the TrustLayer application."""

    PROJECT_NAME: str = "TrustLayer"
    API_V1_STR: str = "/api/v1"

    # Gemini configuration
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_gemini_api_key(self) -> Optional[str]:
        """Retrieve Gemini API key from GEMINI_API_KEY or GOOGLE_API_KEY environment variables."""
        return self.GEMINI_API_KEY or os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")


settings = Settings()
