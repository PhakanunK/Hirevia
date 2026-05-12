from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.enums import ApplicationStatus
from datetime import datetime

class ApplicationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, application_id: int) -> Application | None:
        return self.db.query(Application).filter(Application.id == application_id).first()
    
    def get_by_job_and_email(self, job_id: int, email: str) -> Application | None:
        return self.db.query(Application).filter(Application.job_id == job_id, Application.email == email).first()
    
    def get_all(self, page: int, page_size: int, status=None, job_id=None, keyword=None) -> tuple[list[Application], int]:
        query = self.db.query(Application)
        if status:
            query = query.filter(Application.status == status)
        if job_id:
            query = query.filter(Application.job_id == job_id)
        if keyword:
            query = query.filter(
                Application.first_name.ilike(f"%{keyword}%") |
                Application.last_name.ilike(f"%{keyword}%") |
                Application.email.ilike(f"%{keyword}%")
            )
        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total
    
    def create(self, data: dict) -> Application:
        application = Application(**data)
        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)
        return application
    
    def update(self, application: Application, data: dict) -> Application:
        for key, value in data.items():
            setattr(application, key, value)
        self.db.commit()
        self.db.refresh(application)
        return application
    
    def update_status(self, application: Application, status: ApplicationStatus, interview_date: datetime | None = None, rejected_at: datetime | None = None) -> Application:
        application.status = status
        if interview_date:
          application.interview_date = interview_date
        if rejected_at:
           application.rejected_at = rejected_at
        self.db.commit()
        self.db.refresh(application)
        return application
    
    def update_interview_date(self, application: Application, interview_date: datetime) -> Application:
        application.interview_date = interview_date
        self.db.commit()
        self.db.refresh(application)
        return application