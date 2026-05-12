from sqlalchemy.orm import Session
from app.repositories.application import ApplicationRepository
from app.repositories.job import JobRepository
from app.repositories.application_token import ApplicationTokenRepository
from app.schemas.application import ApplicationSubmit, ApplicationStatusUpdate
from app.models.enums import JobStatus, ApplicationStatus
from datetime import datetime, timezone, timedelta
from app.utils.email import send_application_confirmation, send_status_update
import secrets

class ApplicationNotFound(Exception):
    pass

class JobNotFound(Exception):
    pass

class JobNotOpen(Exception):
    pass

class DuplicateApplication(Exception):
    pass

class ReapplyCooldown(Exception):
    pass

class InvalidStatusTransition(Exception):
    pass

class InvalidToken(Exception):
    pass

class ApplicationService:
    def __init__(self, db: Session):
        self.repo = ApplicationRepository(db)
        self.job_repo = JobRepository(db)
        self.token_repo = ApplicationTokenRepository(db)

    def get_all(self, page: int, page_size: int, status=None, job_id=None, keyword=None):
        items, total = self.repo.get_all(page, page_size, status, job_id, keyword)
        return items, total
    
    def get_by_id(self, application_id: int):
        application = self.repo.get_by_id(application_id)
        if application is None:
            raise ApplicationNotFound()
        return application

    def submit(self, data: ApplicationSubmit):
        job = self.job_repo.get_by_id(data.job_id)
        if job is None:
            raise JobNotFound()
        if job.status != JobStatus.OPEN:
            raise JobNotOpen()
        existing = self.repo.get_by_job_and_email(data.job_id, data.email)
        if existing:
            if existing.status != ApplicationStatus.REJECTED:
                raise DuplicateApplication()
            if existing.rejected_at is not None:
                if existing.rejected_at + timedelta(days=365) > datetime.now(timezone.utc):
                    raise ReapplyCooldown()
            reapply_data = data.model_dump(exclude={"job_id", "email"})
            reapply_data["status"] = ApplicationStatus.APPLIED
            reapply_data["rejected_at"] = None
            reapply_data["interview_date"] = None

            application = self.repo.update(existing, reapply_data)
        else:
            application = self.repo.create(data.model_dump())
        token = secrets.token_urlsafe(32)
        self.token_repo.create({
            "application_id": application.id,
            "token": token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=30)
        })
        send_application_confirmation(
            to_email=data.email,
            first_name=data.first_name,
            job_title=job.title,
            tracking_token=token
        )
        return application, token
    
    def get_status(self, token: str):
        token_record = self.token_repo.get_by_token(token)
        if token_record is None:
            raise InvalidToken()
        if token_record.expires_at <= datetime.now(timezone.utc):
            raise InvalidToken()
        return token_record.application
    
    def update_status(self, application_id: int, status: ApplicationStatus, interview_date: datetime | None = None):
        application = self.repo.get_by_id(application_id)
        if application is None:
            raise ApplicationNotFound()

        valid_transitions = {
            ApplicationStatus.APPLIED: [ApplicationStatus.SCREENING, ApplicationStatus.REJECTED],
            ApplicationStatus.SCREENING: [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED],
            ApplicationStatus.INTERVIEW: [ApplicationStatus.OFFER, ApplicationStatus.REJECTED],
            ApplicationStatus.OFFER: [],
            ApplicationStatus.REJECTED: [],
        }
        if status not in valid_transitions[application.status]:
            raise InvalidStatusTransition()
        rejected_at = None
        if status == ApplicationStatus.REJECTED:
            rejected_at = datetime.now(timezone.utc)
        result = self.repo.update_status(application, status, interview_date, rejected_at=rejected_at)
        send_status_update(
            to_email=result.email,
            first_name=result.first_name,
            job_title=result.job.title,
            status=status.value,
            interview_date=interview_date
        )
        return result
    
    def update_interview_date(self, application_id: int, interview_date: datetime):
        application = self.repo.get_by_id(application_id)
        if application is None:
            raise ApplicationNotFound()
        if application.status != ApplicationStatus.INTERVIEW:
            raise InvalidStatusTransition()
        return self.repo.update_interview_date(application, interview_date)