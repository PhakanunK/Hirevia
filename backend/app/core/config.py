from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ITEMS_PER_PAGE: int = 10

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()