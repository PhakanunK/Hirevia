from pydantic import BaseModel, ConfigDict
from app.models.enums import JobType, JobStatus
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    job_type: JobType
    description: str
    requirements: str
    headcount: int = 1
    min_salary: int
    max_salary: int | None = None
    urgent: bool

class JobUpdate(BaseModel):
    title: str | None = None
    job_type: JobType | None = None
    description: str | None = None
    requirements: str | None = None
    headcount: int | None = None
    min_salary: int | None = None
    max_salary: int | None = None
    urgent: bool | None = None

class JobStatusUpdate(BaseModel):
    status: JobStatus

class JobPublicResponse(BaseModel):
    id: int
    title: str
    job_type: JobType
    description: str
    requirements: str
    headcount: int
    min_salary: int
    max_salary: int | None = None
    urgent: bool
    status: JobStatus
    published_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class JobAdminResponse(BaseModel):
    id: int
    title: str
    job_type: JobType
    description: str
    requirements: str
    headcount: int
    min_salary: int
    max_salary: int | None = None
    urgent: bool
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    user_id: int | None = None
    published_at: datetime | None = None
    closed_at: datetime | None = None
    is_archived: bool
    archived_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)