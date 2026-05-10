from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from math import ceil

from app.core.deps import get_db, get_current_user
from app.core.config import settings
from app.services.job import JobService, JobNotFound, InvalidStatusTransition
from app.schemas.job import JobCreate, JobUpdate, JobStatusUpdate, JobAdminResponse
from app.schemas.pagination import PaginatedResponse, PaginationMeta
from app.models.enums import JobType, JobStatus

router = APIRouter()

@router.get("", response_model=PaginatedResponse[JobAdminResponse])
def get_jobs( page: int = 1,
    page_size: int = settings.PAGE_SIZE_CARD,
    job_type: JobType | None = None,
    urgent: bool | None = None,
    keyword: str | None = None,
    db: Session = Depends(get_db)
):
    service = JobService(db)
    jobs, total = service.get_open_job(page, page_size, job_type=job_type, urgent=urgent, keyword=keyword)
    return PaginatedResponse(
        data=jobs,
        meta=PaginationMeta(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=ceil(total / page_size)
        )
    )

@router.get("/{job_id}", response_model=JobAdminResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    service = JobService(db)
    try:
        return service.get_by_id(job_id)
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")