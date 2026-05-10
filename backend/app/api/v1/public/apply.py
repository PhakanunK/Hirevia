from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.services.application import ApplicationService, JobNotFound, JobNotOpen, DuplicateApplication, ReapplyCooldown
from app.schemas.application import ApplicationSubmit, ApplicationSubmitResponse

router = APIRouter()

@router.post("", response_model=ApplicationSubmitResponse)
def apply(
    data: ApplicationSubmit,
    db: Session = Depends(get_db)
):
    service = ApplicationService(db)
    try:
        application, token = service.submit(data)
        return ApplicationSubmitResponse(
            message="Application submitted successfully!",
            tracking_token=token
        )
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")
    except JobNotOpen:
        raise HTTPException(status_code=422, detail="Job not open")
    except DuplicateApplication:
        raise HTTPException(status_code=409, detail="Duplicate appliction")
    except ReapplyCooldown:
        raise HTTPException(status_code=422, detail="Reapply cooldown")
    