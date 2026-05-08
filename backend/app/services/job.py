from sqlalchemy.orm import Session
from app.repositories.job import JobRepository
from app.schemas.job import JobCreate, JobUpdate
from app.models.enums import JobStatus
from datetime import datetime, timezone

class JobNotFound(Exception):
    pass

class InvalidStatusTransition(Exception):
    pass

class JobService:
    def __init__(self, db: Session):
        self.repo = JobRepository(db)

    def get_all(self):
        return self.repo.get_all()
    
    def get_open_job(self):
        return self.repo.get_open_jobs()
    
    def get_by_id(self, job_id: int):
        job = self.repo.get_by_id(job_id)
        if job is None:
            raise JobNotFound()
        return job
    
    def create(self, user_id: int, data: JobCreate):
        create_data = data.model_dump()
        create_data["user_id"] = user_id
        return self.repo.create(create_data)
    
    def update(self, job_id: int, data: JobUpdate):
        job = self.repo.get_by_id(job_id)
        if job is None:
            raise JobNotFound()
        update_data = data.model_dump(exclude_unset=True)
        return self.repo.update(job, update_data)
    
    def archive(self, job_id: int):
        job = self.repo.get_by_id(job_id)
        if job is None:
            raise JobNotFound()
        return self.repo.archive(job)
    
    def update_status(self, job_id: int, status: JobStatus):
        job = self.repo.get_by_id(job_id)
        if job is None:
            raise JobNotFound()
        if job.is_archived:
            raise InvalidStatusTransition()
        valid_transitions = {
            JobStatus.DRAFT: [JobStatus.OPEN],
            JobStatus.OPEN: [JobStatus.CLOSED],
            JobStatus.CLOSED: [JobStatus.OPEN],
        }
        if status not in valid_transitions[job.status]:
            raise InvalidStatusTransition()
        published_at = None
        closed_at = None
        if status == JobStatus.OPEN:
            published_at = datetime.now(timezone.utc)
        if status == JobStatus.CLOSED:
            closed_at = datetime.now(timezone.utc)
        return self.repo.update_status(job, status, published_at=published_at, closed_at=closed_at)
    