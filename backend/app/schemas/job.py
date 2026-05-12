from pydantic import BaseModel, ConfigDict, field_validator
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

    @field_validator("headcount")
    def headcount_must_be_positive(cls, v):
        if v < 1:
            raise ValueError("Headcount must be at least 1")
        return v
    
    @field_validator("max_salary")
    def max_must_be_greater_than_min(cls, v, info):
        if v is not None and v < info.data.get("min_salary", 0):
            raise ValueError("max_salary must be greater than min_salary")
        return v

class JobUpdate(BaseModel):
    title: str | None = None
    job_type: JobType | None = None
    description: str | None = None
    requirements: str | None = None
    headcount: int | None = None
    min_salary: int | None = None
    max_salary: int | None = None
    urgent: bool | None = None

    @field_validator("headcount")
    def headcount_must_be_positive(cls, v):
        if v is not None and v < 1:
            raise ValueError("Headcount must be at least 1")
        return v
    
    @field_validator("max_salary")
    def max_must_be_greater_than_min(cls, v, info):
        min_salary = info.data.get("min_salary")
        if v is not None and min_salary is not None and v < min_salary:
            raise ValueError("max_salary must be greater than min_salary")
        return v

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