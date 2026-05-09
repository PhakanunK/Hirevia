from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.services.auth import AuthService, WrongEmailOrPassword, PermissionDenied
from app.schemas.auth import Token, UserLogin

router = APIRouter()

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    service = AuthService(db)
    try:
        token = service.login(data.email, data.password)
        return Token(access_token=token, token_type="bearer")
    except WrongEmailOrPassword:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    except PermissionDenied:
        raise HTTPException(status_code=403, detail="Account suspended")