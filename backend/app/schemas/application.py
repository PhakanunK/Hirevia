from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import ApplicationStatus
from datetime import datetime

class ApplicationSubmit(BaseModel):
    job_id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    resume_url: str
    portfolio_url: str | None = None

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    resume_url: str
    portfolio_url: str | None = None
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
    interview_date: datetime | None = None
    rejected_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus

class ApplicationStatusResponse(BaseModel):
    id: int
    job_id: int
    first_name: str
    last_name: str
    status: ApplicationStatus
    interview_date: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class ApplicationSubmitResponse(BaseModel):
    message: str
    tracking_token: str