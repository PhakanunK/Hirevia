from sqlalchemy.orm import Session
from app.repositories.dashboard import DashboardRepository
from app.schemas.dashboard import DashboardResponse, ApplicationSummary, UpcomingInterview, LatestApplication

class DashboardService:
    def __init__(self, db: Session):
        self.repo = DashboardRepository(db)

    def get_dashboard(self) -> DashboardResponse:
        summary_data = self.repo.get_application_summary()
        upcoming = self.repo.get_upcoming_interviews()
        latest = self.repo.get_latest_applications()

        return DashboardResponse(
            total_jobs=self.repo.get_total_jobs(),
            total_urgent_jobs=self.repo.get_total_urgent_jobs(),
            total_applications=self.repo.get_total_active_applications(),
            upcoming_interviews=[
                UpcomingInterview(
                    applicant_name=f"{a.first_name} {a.last_name}",
                    job_title=a.job.title,
                    interview_date=a.interview_date
                ) for a in upcoming
            ],
            latest_applications=[
                LatestApplication(
                    id=a.id,
                    applicant_name=f"{a.first_name} {a.last_name}",
                    job_title=a.job.title,
                    applied_date=a.created_at
                ) for a in latest
            ],
            summary=ApplicationSummary(**summary_data)
        )