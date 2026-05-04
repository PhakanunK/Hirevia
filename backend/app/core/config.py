from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    PAGE_SIZE_CARD: int = 6
    PAGE_SIZE_TABLE: int = 10
    MAX_PAGE_SIZE: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()