from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.repositories.user import UserRepository
from app.utils.security import decode_access_token
from app.models.enums import UserStatus

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        token_data = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    repo = UserRepository(db)
    user = repo.get_by_id(token_data.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Account suspended")
    if user.token_version != token_data.token_version:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user