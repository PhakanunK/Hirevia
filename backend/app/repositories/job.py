from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.enums import JobStatus
from datetime import datetime, timezone

class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, job_id: int) -> Job | None:
        return self.db.query(Job).filter(Job.id == job_id).first()
    
    def get_all(self, page: int, page_size: int, status=None, job_type=None, is_archived=None, keyword=None) -> tuple[list[Job], int]:
        query = self.db.query(Job)
        if status:
            query = query.filter(Job.status == status)
        if job_type:
            query = query.filter(Job.job_type == job_type)
        if is_archived is not None:
            query = query.filter(Job.is_archived == is_archived)
        if keyword:
            query = query.filter(Job.title.ilike(f"%{keyword}%"))
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total
    
    def get_open_jobs(self, page: int, page_size: int, job_type=None, urgent=None, keyword=None) -> tuple[list[Job], int]:
        query = self.db.query(Job).filter(Job.status == JobStatus.OPEN, Job.is_archived == False)
        if job_type:
            query = query.filter(Job.job_type == job_type)
        if urgent is not None:
            query = query.filter(Job.urgent == urgent)
        if keyword:
            query = query.filter(Job.title.ilike(f"%{keyword}%"))
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total
    
    def create(self, data: dict) -> Job:
        job = Job(**data)
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def update(self, job: Job, data: dict) -> Job:
        for key, value in data.items():
            setattr(job, key, value)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def update_status(self, job: Job, status: JobStatus, published_at: datetime | None = None, closed_at: datetime | None = None) -> Job:
        job.status = status
        if published_at:
            job.published_at = published_at
        if closed_at:
            job.closed_at = closed_at
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def archive(self, job: Job) -> Job:
        job.is_archived = True
        job.archived_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(job)
        return job
    