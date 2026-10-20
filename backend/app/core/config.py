from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables (see .env.example)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "BizInsight API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    database_url: str = "mysql+pymysql://bizinsight:change-me@localhost:3306/bizinsight"

    # Supabase Auth: used only to VERIFY tokens. No service-role key is needed for that.
    supabase_url: str = ""
    supabase_jwt_secret: str = ""  # legacy HS256 projects only; leave empty for JWKS
    supabase_jwt_audience: str = "authenticated"

    max_upload_mb: int = 10


@lru_cache
def get_settings() -> Settings:
    return Settings()
