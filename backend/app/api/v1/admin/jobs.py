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
    page_size: int = settings.PAGE_SIZE_TABLE,
    status: JobStatus | None = None,
    job_type: JobType | None = None,
    is_archived: bool | None = None,
    keyword: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    jobs, total = service.get_all(page, page_size, status=status, job_type=job_type, is_archived=is_archived, keyword=keyword)
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
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    try:
        return service.get_by_id(job_id)
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")

@router.post("", response_model=JobAdminResponse)
def create_job(
    data: JobCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    try:
        return service.create(current_user.id, data)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to create job")
    
@router.patch("/{job_id}/status", response_model=JobAdminResponse)
def update_job_status(
    job_id: int,
    data: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    try:
        return service.update_status(job_id, data.status)
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")
    except InvalidStatusTransition:
        raise HTTPException(status_code=422, detail="Invalid status transition")

@router.patch("/{job_id}", response_model=JobAdminResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    try:
        return service.update(job_id, data)
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")
    
@router.delete("/{job_id}")
def archive_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = JobService(db)
    try:
        service.archive(job_id)
        return {"message": "Job archived successfully"}
    except JobNotFound:
        raise HTTPException(status_code=404, detail="Job not found")