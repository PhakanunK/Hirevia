from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    PAGE_SIZE_CARD: int = 6
    PAGE_SIZE_TABLE: int = 10
    MAX_PAGE_SIZE: int = 50
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_BUCKET: str = "resumes"
    RESEND_API_KEY: str
    RESEND_FROM_EMAIL: str
    FRONTEND_URL: str = "http://localhost:3000"

    DEBUG: bool = True

settings = Settings()