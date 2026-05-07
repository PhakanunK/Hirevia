from sqlalchemy.orm import Session
from app.models.job import Job
from app.models.enums import JobStatus

class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, job_id: int) -> Job | None:
        return self.db.query(Job).filter(Job.id == job_id).first()
    
    def get_all(self) -> list[Job]:
        return self.db.query(Job).all()
    
    def get_open_jobs(self) -> list[Job]:
        return self.db.query(Job).filter(Job.status == JobStatus.OPEN).all()
    
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
    