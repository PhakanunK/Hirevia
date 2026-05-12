from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ApplicationSummary(BaseModel):
    applied: int
    screening: int
    interview: int
    offer: int
    rejected: int

class UpcomingInterview(BaseModel):
    applicant_name: str
    job_title: str
    interview_date: datetime

    model_config = ConfigDict(from_attributes=True)

class LatestApplication(BaseModel):
    applicant_name: str
    job_title: str
    applied_date: datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardResponse(BaseModel):
    total_jobs: int
    total_urgent_jobs: int
    total_applications: int 
    upcoming_interviews: list[UpcomingInterview]
    latest_applications: list[LatestApplication]
    summary: ApplicationSummary