from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str
    MONGODB_DB_NAME: str
    OPENAI_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None 

    class Config:
        env_file = ".env"

settings = Settings()
