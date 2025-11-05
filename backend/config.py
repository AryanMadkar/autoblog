from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    mongodb_url: Optional[str] = None
    database_name: Optional[str] = None
    groq_api_key: Optional[str] = None
    admin_api_key: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file = ".env"


@lru_cache
def get_settings():
    return Settings()
