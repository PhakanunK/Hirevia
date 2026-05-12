from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.services.dashboard import DashboardService
from app.schemas.dashboard import DashboardResponse

router = APIRouter()

@router.get("", response_model=DashboardResponse)
def get_dashboard( 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DashboardService(db)
    return service.get_dashboard()