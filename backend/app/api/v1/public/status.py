from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.services.application import ApplicationService, InvalidToken
from app.schemas.application import ApplicationStatusResponse

router = APIRouter()

@router.get("", response_model=ApplicationStatusResponse)
def get_status(
    token: str,
    db: Session = Depends(get_db)
):
    service = ApplicationService(db)
    try:
        return service.get_status(token)
    except InvalidToken:
        raise HTTPException(status_code=401, detail="Invalid token")