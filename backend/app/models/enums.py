import enum

class UserStatus(enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"

class JobType(enum.Enum):
    FULL_TIME = "full_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"

class JobStatus(enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    DRAFT = "draft"

class ApplicationStatus(enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"