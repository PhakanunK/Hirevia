from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from app.models.application import Application
from app.models.job import Job
from app.models.enums import ApplicationStatus

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_total_jobs(self) -> int:
        return self.db.query(Job).filter(Job.is_archived == False).count()

    def get_total_urgent_jobs(self) -> int:
        return self.db.query(Job).filter(Job.is_archived == False, Job.urgent == True).count()

    def get_total_active_applications(self) -> int:
        return self.db.query(Application).filter(Application.status != ApplicationStatus.REJECTED).count()

    def get_application_summary(self) -> dict:
        results = self.db.query(Application.status, func.count(Application.id)).group_by(Application.status).all()

        summary = {"applied": 0, "screening": 0, "interview": 0, "offer": 0, "rejected": 0}
        for status, count in results:
            summary[status.value] = count
        return summary

    def get_upcoming_interviews(self, limit: int = 5) -> list:
        now = datetime.now(timezone.utc)
        week_later = now + timedelta(days=7)
        
        return self.db.query(Application).join(Job).filter(
            Application.status == ApplicationStatus.INTERVIEW,
            Application.interview_date >= now,
            Application.interview_date <= week_later
        ).order_by(Application.interview_date.asc()).limit(limit).all()

    def get_latest_applications(self, limit: int = 5) -> list:
        return self.db.query(Application).join(Job).filter(
            Application.status == ApplicationStatus.APPLIED
        ).order_by(Application.created_at.desc()).limit(limit).all()