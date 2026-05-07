from passlib.hash import argon2
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
from app.core.config import settings
from app.schemas.auth import TokenData

def hash_password(password: str) -> str:
    hashed_password = argon2.hash(password)
    return hashed_password

def verify_password(plain: str, hashed: str) -> bool:
    return argon2.verify(plain, hashed)
    
def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["exp"] = expire
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token:str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return TokenData(
            user_id=int(payload["sub"]),
            token_version=payload["token_version"]
        )
    except JWTError:
        raise ValueError("Invalid or expired token")