from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    APP_NAME: str = "FastAPI Backend"
    DEBUG: bool = True
    OPENAI_API_KEY: Optional[str] = None
    AI_MODE: str = "rule"
    CORS_ORIGINS: str = "*"

    # Add MongoDB fields
    MONGO_URI: str
    MONGO_DB: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS.strip() == "":
            return ["*"]
        return [s.strip() for s in self.CORS_ORIGINS.split(",")]

settings = Settings()
