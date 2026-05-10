from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from math import ceil

from app.core.deps import get_db, get_current_user
from app.core.config import settings
from app.services.application import ApplicationService, ApplicationNotFound, InvalidStatusTransition
from app.schemas.application import ApplicationStatusUpdate, ApplicationResponse
from app.schemas.pagination import PaginatedResponse, PaginationMeta
from app.models.enums import ApplicationStatus

router = APIRouter()

@router.get("", response_model=PaginatedResponse[ApplicationResponse])
def get_applications( page: int = 1,
    page_size: int = settings.PAGE_SIZE_TABLE,
    status: ApplicationStatus | None = None,
    job_id: int | None = None,
    keyword: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ApplicationService(db)
    applications, total = service.get_all(page, page_size, status, job_id, keyword)
    return PaginatedResponse(
        data=applications,
        meta=PaginationMeta(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=ceil(total / page_size)
        )
    )

@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ApplicationService(db)
    try:
        return service.update_status(application_id, data.status, data.interview_date)
    except ApplicationNotFound:
        raise HTTPException(status_code=404, detail="Application not found")
    except InvalidStatusTransition:
        raise HTTPException(status_code=422, detail="Invalid status transition")

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = ApplicationService(db)
    try:
        return service.get_by_id(application_id)
    except ApplicationNotFound:
        raise HTTPException(status_code=404, detail="Application not found")